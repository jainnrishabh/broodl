import Main from "@/components/Main";
import Dashboard from "@/components/Dashboard";

export const metadata = {
    title: "Broodl ⋅ Dashboard",
    description: "Track your daily mood every day of the year",
  };

export default function DashboardPage() {
    return (
        <Main><Dashboard/></Main>
    )
}