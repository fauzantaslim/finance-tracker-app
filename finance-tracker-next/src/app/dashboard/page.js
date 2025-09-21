"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "@iconify/react";
import { clearAuth } from "@/redux/slices/authSlice";
import PageLayout from "@/components/layouts/PageLayout";
import FormDashboard from "@/components/fragments/FormDashboard";
import dashboardService from "@/services/dashboard.service";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);

  // Protect the dashboard route and fetch user data if needed
  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
      return;
    }

    // Fetch dashboard data when the component mounts
    const fetchDashboardData = async () => {
      try {
        // You can use the dashboard service here to fetch data
        // const response = await dashboardService.getDashboardSummary(accessToken);
        // Then update your state with the fetched data
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (error.response?.status === 401) {
          // Token is invalid, redirect to login
          dispatch(clearAuth());
          router.push("/login");
        }
      }
    };

    fetchDashboardData();
  }, [accessToken, router]);

  if (!accessToken) {
    return null; // Don't render anything while redirecting
  }

  const rightActions = (
    <>
      <Icon
        icon="mdi:wallet"
        className="text-xl text-gray-600 hover:text-yellow-600 cursor-pointer"
      />
      <Icon
        icon="mdi:folder"
        className="text-xl text-gray-600 hover:text-yellow-600 cursor-pointer"
      />
      <Icon
        icon="mdi:cog"
        className="text-xl text-gray-600 hover:text-yellow-600 cursor-pointer"
      />
    </>
  );

  return (
    <PageLayout title="Dashboard" rightActions={rightActions}>
      <FormDashboard />
    </PageLayout>
  );
}
