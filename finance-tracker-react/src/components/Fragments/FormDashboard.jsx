import { useEffect, useRef, useState, useCallback } from "react";
import { useImmer } from "use-immer";
import { useSelector } from "react-redux";
import { motion as Motion } from "motion/react";
import { Icon } from "@iconify/react";
import Section, { TabSection, Card } from "../Layouts/Section";
import * as echarts from "echarts";
import {
  getDashboard,
  getDashboardCategories,
  getDashboardTransactions,
} from "../../services/dashboard.service";

export default function FormDashboard() {
  const [activeTab, setActiveTab] = useState("Summary");
  const [activeTimeframe, setActiveTimeframe] = useState("week");
  const chartRef = useRef(null);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [dashboardState, updateDashboardState] = useImmer({
    summary: null,
    categories: [],
    transactions: [],
    transactionList: [],
    pagination: null,
    loading: false,
    error: null,
    transactionFilter: "All",
  });

  const timeframeToDateParams = (timeframe) => {
    const now = new Date();

    // Mapping timeframe ke API filter values
    const timeframeMap = {
      week: "week",
      month: "month",
      year: "year",
      "7d": "custom",
      "14d": "custom",
      "30d": "custom",
      "3m": "custom",
      "6m": "custom",
      "12m": "custom",
    };

    const dateFilter = timeframeMap[timeframe] || "week";

    // Jika custom, kita perlu menentukan start_date dan end_date
    if (dateFilter === "custom") {
      const start = new Date(now);
      const daysMap = {
        "7d": 7,
        "14d": 14,
        "30d": 30,
        "3m": 90,
        "6m": 180,
        "12m": 365,
      };
      const days = daysMap[timeframe] ?? 7;
      start.setDate(start.getDate() - (days - 1));

      return {
        date_filter: "custom",
        start_date: start.toISOString(),
        end_date: now.toISOString(),
      };
    }

    // Untuk week, month, year - API akan handle sendiri
    return {
      date_filter: dateFilter,
    };
  };

  const buildChartData = useCallback(
    (transactionsForChart = []) => {
      // Pisahkan data income dan expense
      const incomeData = transactionsForChart.filter(
        (t) => t.type === "income"
      );
      const expenseData = transactionsForChart.filter(
        (t) => t.type === "expense"
      );

      // Jika timeframe adalah "year", kelompokkan data per bulan
      if (activeTimeframe === "year") {
        const monthlyIncomeData = {};
        const monthlyExpenseData = {};

        // Kelompokkan income per bulan
        incomeData.forEach((t) => {
          const date = new Date(t.transaction_date);
          const monthKey = date.toLocaleDateString("en-US", { month: "short" });

          if (!monthlyIncomeData[monthKey]) {
            monthlyIncomeData[monthKey] = 0;
          }
          monthlyIncomeData[monthKey] += t.amount;
        });

        // Kelompokkan expense per bulan
        expenseData.forEach((t) => {
          const date = new Date(t.transaction_date);
          const monthKey = date.toLocaleDateString("en-US", { month: "short" });

          if (!monthlyExpenseData[monthKey]) {
            monthlyExpenseData[monthKey] = 0;
          }
          monthlyExpenseData[monthKey] += t.amount;
        });

        // Urutkan berdasarkan urutan bulan
        const monthOrder = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const labels = monthOrder.filter(
          (month) =>
            monthlyIncomeData[month] !== undefined ||
            monthlyExpenseData[month] !== undefined
        );

        const incomeValues = labels.map(
          (month) => monthlyIncomeData[month] || 0
        );
        const expenseValues = labels.map(
          (month) => monthlyExpenseData[month] || 0
        );

        return { labels, incomeValues, expenseValues };
      }

      // Untuk timeframe lainnya, tampilkan data per tanggal
      const allDates = [...incomeData, ...expenseData]
        .map((t) => new Date(t.transaction_date))
        .sort((a, b) => a - b)
        .map((date) =>
          date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        );

      // Remove duplicates and sort
      const labels = [...new Set(allDates)].sort((a, b) => {
        const dateA = new Date(a + " " + new Date().getFullYear());
        const dateB = new Date(b + " " + new Date().getFullYear());
        return dateA - dateB;
      });

      const incomeValues = labels.map((label) => {
        const total = incomeData
          .filter((t) => {
            const date = new Date(t.transaction_date);
            const dateStr = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            return dateStr === label;
          })
          .reduce((sum, t) => sum + t.amount, 0);
        return total;
      });

      const expenseValues = labels.map((label) => {
        const total = expenseData
          .filter((t) => {
            const date = new Date(t.transaction_date);
            const dateStr = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            return dateStr === label;
          })
          .reduce((sum, t) => sum + t.amount, 0);
        return total;
      });

      return { labels, incomeValues, expenseValues };
    },
    [activeTimeframe]
  );

  useEffect(() => {
    if (!chartRef.current) return;
    const instance = echarts.init(chartRef.current);
    const { labels, incomeValues, expenseValues } = buildChartData(
      dashboardState.transactions
    );

    // Tentukan series berdasarkan activeTab
    let series = [];

    if (activeTab === "Summary") {
      // Summary: tampilkan stacked bar (income hijau di bawah, expense merah di atas)
      series = [
        {
          name: "Income",
          type: "bar",
          data: incomeValues,
          itemStyle: { color: "#22c55e" },
          barWidth: "20%",
          stack: "total",
        },
        {
          name: "Expense",
          type: "bar",
          data: expenseValues,
          itemStyle: { color: "#ef4444" },
          barWidth: "20%",
          stack: "total",
        },
      ];
    } else if (activeTab === "Income") {
      // Income: hanya bar hijau
      series = [
        {
          name: "Income",
          type: "bar",
          data: incomeValues,
          itemStyle: { color: "#22c55e" },
          barWidth: "20%",
        },
      ];
    } else if (activeTab === "Expense") {
      // Expense: hanya bar merah
      series = [
        {
          name: "Expense",
          type: "bar",
          data: expenseValues,
          itemStyle: { color: "#ef4444" },
          barWidth: "20%",
        },
      ];
    }

    // Get container dimensions for responsive design
    const containerWidth = chartRef.current.offsetWidth;
    const isMobile = containerWidth < 640; // sm breakpoint

    instance.setOption({
      backgroundColor: "#ffffff",
      grid: {
        left: isMobile ? 30 : 40,
        right: isMobile ? 10 : 20,
        top: isMobile ? 15 : 20,
        bottom: isMobile ? 25 : 30,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        textStyle: {
          fontSize: isMobile ? 12 : 14,
        },
      },
      legend: {
        data: activeTab === "Summary" ? ["Income", "Expense"] : [activeTab],
        top: 0,
        textStyle: {
          color: "#111",
          fontSize: isMobile ? 12 : 14,
        },
      },
      xAxis: {
        type: "category",
        data: labels,
        axisLine: { lineStyle: { color: "#000" } },
        axisLabel: {
          color: "#111",
          fontSize: isMobile ? 10 : 12,
        },
        axisTick: { alignWithLabel: true },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#000" } },
        axisLabel: {
          color: "#111",
          fontSize: isMobile ? 10 : 12,
        },
        splitLine: { lineStyle: { color: "#000", opacity: 0.15 } },
      },
      series: series,
    });

    const onResize = () => instance.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      instance.dispose();
    };
  }, [dashboardState.transactions, buildChartData, activeTab]);

  const fetchTransactions = useCallback(
    async (type = "all") => {
      if (!accessToken) return;
      updateDashboardState((draft) => {
        draft.loading = true;
        draft.error = null;
      });
      try {
        const params = timeframeToDateParams(activeTimeframe);
        const tx = await getDashboardTransactions(accessToken, {
          ...params,
          type,
          page: 1,
          limit: 10,
        });
        updateDashboardState((draft) => {
          draft.pagination = tx?.pagination ?? null;
          draft.transactionList = tx?.transactions ?? [];
          draft.loading = false;
        });
      } catch {
        updateDashboardState((draft) => {
          draft.loading = false;
          draft.error = "Gagal memuat data transaksi";
        });
      }
    },
    [accessToken, activeTimeframe, updateDashboardState]
  );

  useEffect(() => {
    const fetchAll = async () => {
      if (!accessToken) return;
      updateDashboardState((draft) => {
        draft.loading = true;
        draft.error = null;
      });
      try {
        const params = timeframeToDateParams(activeTimeframe);
        const [dash, categories, tx] = await Promise.all([
          getDashboard(accessToken, params),
          getDashboardCategories(accessToken, params),
          getDashboardTransactions(accessToken, {
            ...params,
            type: "all",
            page: 1,
            limit: 10,
          }),
        ]);
        updateDashboardState((draft) => {
          draft.summary = dash?.summary ?? null;
          draft.transactions = dash?.transactions ?? [];
          draft.categories = categories ?? [];
          draft.pagination = tx?.pagination ?? null;
          draft.transactionList = tx?.transactions ?? [];
          draft.loading = false;
        });
      } catch {
        updateDashboardState((draft) => {
          draft.loading = false;
          draft.error = "Gagal memuat data dashboard";
        });
      }
    };
    fetchAll();
  }, [accessToken, activeTimeframe, updateDashboardState]);

  const tabs = ["Summary", "Expense", "Income"];
  const timeframes = [
    "week",
    "month",
    "year",
    "7d",
    "14d",
    "30d",
    "3m",
    "6m",
    "12m",
  ];

  return (
    <>
      {/* Summary Tabs */}
      <Section title="">
        <div className="overflow-x-auto pb-2">
          <TabSection
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="mb-6"
          />
        </div>
      </Section>

      {/* Timeframe Selector & Chart */}
      <Section title="">
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          {timeframes.map((timeframe) => (
            <Motion.button
              key={timeframe}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTimeframe(timeframe)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors border-2 whitespace-nowrap ${
                activeTimeframe === timeframe
                  ? "bg-yellow-400 text-black border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                  : "text-gray-600 hover:text-black hover:bg-yellow-100 border-transparent hover:border-black"
              }`}
            >
              {timeframe}
            </Motion.button>
          ))}
        </div>

        {/* ECharts Container */}
        <div className="bg-white border-2 border-black rounded-lg p-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-transform duration-150 ease-out">
          <div ref={chartRef} className="h-48 sm:h-64 w-full" />
        </div>
      </Section>

      {/* Financial Summary */}
      <Section title="Summary">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            title="Expense"
            value={
              dashboardState.summary?.total_expense
                ? `Rp ${dashboardState.summary.total_expense.toLocaleString()}`
                : "Rp 0"
            }
            color="red"
            icon="mdi:arrow-down"
            neoBrutalism={true}
          />
          <Card
            title="Income"
            value={
              dashboardState.summary?.total_income
                ? `Rp ${dashboardState.summary.total_income.toLocaleString()}`
                : "Rp 0"
            }
            color="green"
            icon="mdi:arrow-up"
            neoBrutalism={true}
          />
          <Card
            title="Net Income"
            value={
              dashboardState.summary?.net_income
                ? `Rp ${dashboardState.summary.net_income.toLocaleString()}`
                : "Rp 0"
            }
            color={dashboardState.summary?.net_income >= 0 ? "green" : "red"}
            icon="mdi:cash-multiple"
            neoBrutalism={true}
          />
        </div>
      </Section>

      {/* Grid Layout for Categories and Transactions - Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* List Categories */}
        <Section title="List categories">
          <div className="space-y-3">
            {dashboardState.loading ? (
              <div className="flex items-center justify-center p-4">
                <div className="text-gray-500">Loading categories...</div>
              </div>
            ) : dashboardState.categories.length > 0 ? (
              dashboardState.categories.map((category) => (
                <div
                  key={category.category_id}
                  className="flex items-center justify-between p-3 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-transform duration-150 ease-out hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-black"
                      style={{
                        backgroundColor:
                          category.category_color ||
                          (category.category_type === "income"
                            ? "#22c55e"
                            : "#ef4444"),
                      }}
                    >
                      <Icon
                        icon={category.category_icon || "mdi:folder"}
                        className="text-xl text-white"
                      />
                    </div>
                    <span className="text-black font-medium">
                      {category.category_name}
                    </span>
                  </div>
                  <span
                    className={`font-bold ${
                      category.category_type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {category.total_amount?.toLocaleString() || "0"}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center p-4 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <div className="text-gray-500">No categories found</div>
              </div>
            )}
          </div>
        </Section>

        {/* Transactions */}
        <Section
          title="Recent Transactions"
          rightActions={
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Only with description
              </span>
              <div className="w-10 h-5 bg-gray-400 border-2 border-black rounded-full relative">
                <div className="w-4 h-4 bg-yellow-400 border-2 border-black rounded-full absolute top-0.5 left-0.5"></div>
              </div>
            </div>
          }
        >
          <TabSection
            tabs={["All", "Expense", "Income"]}
            activeTab={dashboardState.transactionFilter || "All"}
            onTabChange={(tab) => {
              const filterMap = {
                All: "all",
                Expense: "expense",
                Income: "income",
              };
              updateDashboardState((draft) => {
                draft.transactionFilter = tab;
              });
              fetchTransactions(filterMap[tab]);
            }}
            className="mb-4"
          />

          <div className="space-y-3">
            {dashboardState.loading ? (
              <div className="flex items-center justify-center p-4">
                <div className="text-gray-500">Loading transactions...</div>
              </div>
            ) : dashboardState.transactionList?.length > 0 ? (
              dashboardState.transactionList.map((transaction) => (
                <div
                  key={transaction.transaction_id}
                  className="flex items-center justify-between p-3 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-transform duration-150 ease-out hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-black"
                      style={{
                        backgroundColor:
                          transaction.category_color ||
                          (transaction.type === "income"
                            ? "#22c55e"
                            : "#ef4444"),
                      }}
                    >
                      <Icon
                        icon={transaction.category_icon || "mdi:cash-multiple"}
                        className="text-xl text-white"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-black font-medium">
                        {transaction.category_name || "Unknown Category"}
                      </span>
                      {transaction.description && (
                        <span className="text-gray-600 text-sm">
                          {transaction.description}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`font-bold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}{" "}
                      {transaction.amount?.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(
                        transaction.transaction_date
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center p-4 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <div className="text-gray-500">No transactions found</div>
              </div>
            )}
          </div>
        </Section>
      </div>
    </>
  );
}
