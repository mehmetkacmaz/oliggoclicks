"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Pencil,
  Trash2,
  MoreVertical,
  UserPlus,
  Search,
  Shield,
  User,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Lock,
  Unlock,
  Facebook,
} from "lucide-react"
import { authService, type User as AuthUser } from "@/services/auth-service"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Facebook hesap tipi
interface FacebookAccountInfo {
  id: string
  name: string
  shortName: string
  color: string
  status: "active" | "paused" | "limited"
}

export function UserManagement() {
  const [users, setUsers] = useState<AuthUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false)
  const [isViewUserOpen, setIsViewUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [newUser, setNewUser] = useState({
    id: "",
    email: "",
    password: "",
    name: "",
    surname: "",
    type: "basic",
    profile_picture: "",
    status: "active",
    lastLogin: "",
    createdAt: "",
    facebookAccounts: [] as FacebookAccountInfo[],
  })
  const { toast } = useToast()

  // Facebook hesapları için örnek renkler
  const facebookColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-orange-500",
  ]

  // Facebook hesapları için örnek durumlar
  const facebookStatuses = ["active", "paused", "limited"] as const

  useEffect(() => {
    // Kullanıcıları yükle
    setIsLoading(true)
    setTimeout(() => {
      const allUsers = authService.getAllUsers().map((user) => {
        // Her kullanıcı için rastgele Facebook hesapları oluştur
        const facebookAccountCount = Math.floor(Math.random() * 3) // 0-2 arası hesap
        const facebookAccounts: FacebookAccountInfo[] = []

        for (let i = 0; i < facebookAccountCount; i++) {
          const name = `${user.name}'s FB Account ${i + 1}`
          const shortName = name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()

          facebookAccounts.push({
            id: `fb-${user.id}-${i}`,
            name,
            shortName,
            color: facebookColors[Math.floor(Math.random() * facebookColors.length)],
            status: facebookStatuses[Math.floor(Math.random() * facebookStatuses.length)],
          })
        }

        return {
          ...user,
          status: Math.random() > 0.8 ? "inactive" : "active",
          lastLogin: getRandomDate(),
          createdAt: getRandomDate(true),
          facebookAccounts,
        }
      })
      setUsers(allUsers)
      setIsLoading(false)
    }, 800)
  }, [])

  // Rastgele tarih oluştur
  const getRandomDate = (older = false) => {
    const now = new Date()
    const days = older ? Math.floor(Math.random() * 90) + 30 : Math.floor(Math.random() * 30)
    const hours = Math.floor(Math.random() * 24)
    const minutes = Math.floor(Math.random() * 60)

    now.setDate(now.getDate() - days)
    now.setHours(hours)
    now.setMinutes(minutes)

    return now.toISOString().split("T")[0] + " " + now.toTimeString().split(" ")[0].substring(0, 5)
  }

  // Filtrelenmiş kullanıcılar
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "admin") return matchesSearch && user.type === "admin"
    if (activeTab === "basic") return matchesSearch && user.type === "basic"
    if (activeTab === "active") return matchesSearch && user.status === "active"
    if (activeTab === "inactive") return matchesSearch && user.status === "inactive"

    return matchesSearch
  })

  // Pagination
  const usersPerPage = 10
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  // Kullanıcı ekleme
  const handleAddUser = () => {
    // Yeni ID oluştur
    const newId = (1000000000 + users.length + 1).toString()

    const userToAdd = {
      ...newUser,
      id: newId,
      profile_picture: `/images/avatars/default.jpg`,
      status: "active",
      lastLogin: "-",
      createdAt: new Date().toISOString().split("T")[0] + " " + new Date().toTimeString().split(" ")[0].substring(0, 5),
      facebookAccounts: [],
    }

    // Kullanıcıyı ekle
    setUsers([...users, userToAdd])

    // Formu sıfırla ve kapat
    setNewUser({
      id: "",
      email: "",
      password: "",
      name: "",
      surname: "",
      type: "basic",
      profile_picture: "",
      status: "active",
      lastLogin: "",
      createdAt: "",
      facebookAccounts: [],
    })
    setIsAddUserOpen(false)

    toast({
      title: "User Added",
      description: `${userToAdd.name} ${userToAdd.surname} has been added successfully.`,
    })
  }

  // Kullanıcı düzenleme
  const handleEditUser = () => {
    if (!selectedUser) return

    // Kullanıcıyı güncelle
    setUsers(users.map((user) => (user.id === selectedUser.id ? selectedUser : user)))

    // Formu kapat
    setIsEditUserOpen(false)

    toast({
      title: "User Updated",
      description: `${selectedUser.name} ${selectedUser.surname} has been updated successfully.`,
    })
  }

  // Kullanıcı silme
  const handleDeleteUser = () => {
    if (!selectedUser) return

    // Kullanıcıyı sil
    setUsers(users.filter((user) => user.id !== selectedUser.id))

    // Formu kapat
    setIsDeleteUserOpen(false)

    toast({
      title: "User Deleted",
      description: `${selectedUser.name} ${selectedUser.surname} has been deleted successfully.`,
    })
  }

  // Toplu işlemler
  const handleBulkAction = (action: string) => {
    if (selectedRows.length === 0) return

    if (action === "delete") {
      // Seçili kullanıcıları sil
      setUsers(users.filter((user) => !selectedRows.includes(user.id)))
      setSelectedRows([])
      toast({
        title: "Users Deleted",
        description: `${selectedRows.length} users have been deleted successfully.`,
      })
    } else if (action === "activate") {
      // Seçili kullanıcıları aktifleştir
      setUsers(users.map((user) => (selectedRows.includes(user.id) ? { ...user, status: "active" } : user)))
      setSelectedRows([])
      toast({
        title: "Users Activated",
        description: `${selectedRows.length} users have been activated successfully.`,
      })
    } else if (action === "deactivate") {
      // Seçili kullanıcıları deaktifleştir
      setUsers(users.map((user) => (selectedRows.includes(user.id) ? { ...user, status: "inactive" } : user)))
      setSelectedRows([])
      toast({
        title: "Users Deactivated",
        description: `${selectedRows.length} users have been deactivated successfully.`,
      })
    }
  }

  // Tüm satırları seç/kaldır
  const toggleSelectAll = () => {
    if (selectedRows.length === currentUsers.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(currentUsers.map((user) => user.id))
    }
  }

  // Tek satır seç/kaldır
  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  // Facebook hesabı durumuna göre badge rengi
  const getFacebookStatusBadge = (status: FacebookAccountInfo["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case "paused":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-0">
            <Clock className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        )
      case "limited":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Limited
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage and monitor user accounts in your system.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsAddUserOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <TabsList className="mb-2 md:mb-0">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
            <TabsTrigger value="basic">Basic Users</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isFilterOpen && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="filter-role">Role</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="filter-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="basic">Basic User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="filter-status">Status</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="filter-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="filter-date">Registration Date</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="filter-date">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" className="mr-2">
                  Reset
                </Button>
                <Button>Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedRows.length > 0 && (
          <Card className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="font-medium">{selectedRows.length} users selected</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("activate")}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activate
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("deactivate")}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Deactivate
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2">Loading users...</span>
                </div>
              ) : currentUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <User className="h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">No users found</h3>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]">
                          <Checkbox
                            checked={selectedRows.length === currentUsers.length && currentUsers.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedRows.includes(user.id)}
                              onCheckedChange={() => toggleSelectRow(user.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {user.name} {user.surname}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.type === "admin" ? (
                              <div className="flex items-center">
                                <Shield className="h-4 w-4 text-blue-500 mr-1" />
                                <span>Admin</span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <User className="h-4 w-4 text-gray-500 mr-1" />
                                <span>Basic</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.status === "active" ? (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                              >
                                Active
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/40 dark:text-gray-400 dark:border-gray-800"
                              >
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{user.lastLogin}</TableCell>
                          <TableCell>{user.createdAt}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setIsViewUserOpen(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setIsEditUserOpen(true)
                                  }}
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setIsDeleteUserOpen(true)
                                  }}
                                  className="text-red-600 dark:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4 dark:border-gray-700">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{" "}
                <span className="font-medium">{filteredUsers.length}</span> users
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNumber = i + 1
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={currentPage === pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  {totalPages > 5 && (
                    <PaginationItem>
                      <PaginationLink>...</PaginationLink>
                    </PaginationItem>
                  )}
                  {totalPages > 5 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(totalPages)} isActive={currentPage === totalPages}>
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account in the system.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">First Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Last Name</Label>
                <Input
                  id="surname"
                  value={newUser.surname}
                  onChange={(e) => setNewUser({ ...newUser, surname: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">User Type</Label>
                <Select
                  value={newUser.type}
                  onValueChange={(value) => setNewUser({ ...newUser, type: value as "admin" | "basic" })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newUser.status}
                  onValueChange={(value) => setNewUser({ ...newUser, status: value as "active" | "inactive" })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="send-email">Send welcome email</Label>
                <Switch id="send-email" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and settings.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">First Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-surname">Last Name</Label>
                  <Input
                    id="edit-surname"
                    value={selectedUser.surname}
                    onChange={(e) => setSelectedUser({ ...selectedUser, surname: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">User Type</Label>
                  <Select
                    value={selectedUser.type}
                    onValueChange={(value) => setSelectedUser({ ...selectedUser, type: value as "admin" | "basic" })}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={selectedUser.status}
                    onValueChange={(value) =>
                      setSelectedUser({ ...selectedUser, status: value as "active" | "inactive" })
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Password Management</Label>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="justify-start">
                    <Lock className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Unlock className="h-4 w-4 mr-2" />
                    Force Password Change
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={isViewUserOpen} onOpenChange={setIsViewUserOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View detailed information about this user.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-medium">
                  {selectedUser.name[0]}
                  {selectedUser.surname[0]}
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {selectedUser.name} {selectedUser.surname}
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">User Type</h4>
                  <p className="flex items-center">
                    {selectedUser.type === "admin" ? (
                      <>
                        <Shield className="h-4 w-4 text-blue-500 mr-1" />
                        <span>Administrator</span>
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4 text-gray-500 mr-1" />
                        <span>Basic User</span>
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                  <p>
                    {selectedUser.status === "active" ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/40 dark:text-gray-400 dark:border-gray-800"
                      >
                        Inactive
                      </Badge>
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Login</h4>
                  <p>{selectedUser.lastLogin}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
                  <p>{selectedUser.createdAt}</p>
                </div>
              </div>

              {/* Facebook Hesapları */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium mb-2">Connected Facebook Accounts</h4>
                {selectedUser.facebookAccounts && selectedUser.facebookAccounts.length > 0 ? (
                  <div className="space-y-3">
                    {selectedUser.facebookAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full ${account.color} flex items-center justify-center text-white font-semibold`}
                          >
                            {account.shortName}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{account.name}</p>
                            <div className="flex items-center mt-1">
                              <Facebook className="h-3 w-3 text-blue-500 mr-1" />
                              <span className="text-xs text-muted-foreground">Facebook Account</span>
                            </div>
                          </div>
                        </div>
                        <div>{getFacebookStatusBadge(account.status)}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No Facebook accounts connected.</p>
                )}
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm">Logged in from 192.168.1.1</p>
                      <p className="text-xs text-muted-foreground">Today, 10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm">Updated profile information</p>
                      <p className="text-xs text-muted-foreground">Yesterday, 2:15 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm">Changed password</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewUserOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewUserOpen(false)
                setIsEditUserOpen(true)
              }}
            >
              Edit User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                <div>
                  <h4 className="font-medium text-red-600 dark:text-red-400">Warning</h4>
                  <p className="text-sm text-red-600/80 dark:text-red-400/80">
                    You are about to permanently delete this user account. This action cannot be undone.
                  </p>
                </div>
              </div>
              <p>
                Are you sure you want to delete the user{" "}
                <span className="font-semibold">
                  {selectedUser.name} {selectedUser.surname}
                </span>
                ?
              </p>
              <div className="mt-4">
                <Label htmlFor="confirm-delete" className="text-sm font-medium">
                  Type "DELETE" to confirm
                </Label>
                <Input id="confirm-delete" className="mt-1" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
