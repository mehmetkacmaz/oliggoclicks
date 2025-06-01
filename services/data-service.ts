import facebookAccounts from "@/data/facebook_accounts.json"
import dashboardData from "@/data/dashboard_data.json"

export const dataService = {
  getFacebookAccounts: (userId: string) => {
    return facebookAccounts[userId as keyof typeof facebookAccounts] || []
  },

  getDashboardData: (userId: string) => {
    return dashboardData[userId as keyof typeof dashboardData] || null
  },
}
