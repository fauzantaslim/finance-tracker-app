import { Icon } from "@iconify/react";
import PageLayout from "../components/Layouts/PageLayout";
import FormDashboard from "../components/Fragments/FormDashboard";

export default function DashboardPage() {
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
