import { motion as Motion } from "motion/react";
import { Icon } from "@iconify/react";

export default function Section({
  title,
  children,
  rightActions,
  className = "",
}) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-6 border-b-2 border-black last:border-b-0 ${className}`}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black">{title}</h2>
        {rightActions && (
          <div className="flex items-center space-x-2">{rightActions}</div>
        )}
      </div>

      {/* Section Content */}
      <div className="text-black">{children}</div>
    </Motion.div>
  );
}

// Tab Component for sections with tabs
export function TabSection({ tabs, activeTab, onTabChange, className = "" }) {
  return (
    <div className={`flex space-x-1 mb-4 ${className}`}>
      {tabs.map((tab) => (
        <Motion.button
          key={tab}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border-2 ${
            activeTab === tab
              ? "bg-yellow-400 text-black border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
              : "text-gray-600 hover:text-black hover:bg-yellow-100 border-transparent hover:border-black"
          }`}
        >
          {tab}
        </Motion.button>
      ))}
    </div>
  );
}

// Card Component for displaying data
export function Card({
  title,
  value,
  icon,
  color = "neutral",
  className = "",
  neoBrutalism = false,
}) {
  const colorClasses = {
    green: neoBrutalism ? "text-green-600" : "text-green-400",
    red: neoBrutalism ? "text-red-600" : "text-red-400",
    yellow: neoBrutalism ? "text-yellow-600" : "text-yellow-400",
    blue: neoBrutalism ? "text-blue-600" : "text-blue-400",
    neutral: "text-black",
  };

  const neoStyles = neoBrutalism
    ? "bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-transform duration-150 ease-out"
    : "bg-gray-200";

  return (
    <Motion.div
      whileHover={{ scale: neoBrutalism ? 1 : 1.02 }}
      className={`border-2 border-black rounded-lg p-4 ${neoStyles} ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-sm ${
            neoBrutalism ? "font-medium text-black" : "text-gray-600"
          }`}
        >
          {title}
        </span>
        {icon && (
          <div
            className={
              neoBrutalism
                ? "w-8 h-8 rounded-full flex items-center justify-center border-2 border-black bg-black"
                : ""
            }
          >
            <Icon
              icon={icon}
              className={`text-lg ${
                neoBrutalism ? "text-white" : colorClasses[color]
              }`}
            />
          </div>
        )}
      </div>
      <div
        className={`text-sm sm:text-lg ${
          neoBrutalism ? "font-bold" : "font-semibold"
        } ${colorClasses[color]}`}
      >
        {value}
      </div>
    </Motion.div>
  );
}
