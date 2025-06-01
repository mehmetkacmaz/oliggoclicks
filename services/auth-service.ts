import users from "@/data/users.json"

export interface User {
  id: string
  email: string
  password: string
  profile_picture: string
  name: string
  surname: string
  type: "admin" | "basic"
}

export const authService = {
  login: (email: string, password: string): User | null => {
    const user = users.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password)

    if (user) {
      // Güvenlik için şifreyi döndürmeden önce kaldır
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword as User
    }

    return null
  },

  getUserById: (id: string): User | null => {
    const user = users.find((user) => user.id === id)

    if (user) {
      // Güvenlik için şifreyi döndürmeden önce kaldır
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword as User
    }

    return null
  },

  getAllUsers: (): User[] => {
    // Şifreleri kaldırarak tüm kullanıcıları döndür
    return users.map((user) => {
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword as User
    })
  },
}
