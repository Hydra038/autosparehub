import Link from 'next/link'
import { createServerClient } from '@/lib/supabaseServer'
import AdminLogoutButton from '@/components/AdminLogoutButton'

async function getUsers() {
  const supabase = await createServerClient()

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }

  return users || []
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
    customers: users.filter((u) => u.role === 'customer').length,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage all user accounts
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Total Users
          </div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Administrators
          </div>
          <div className="text-3xl font-bold text-blue-600">{stats.admins}</div>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Customers
          </div>
          <div className="text-3xl font-bold text-green-600">{stats.customers}</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border bg-white">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">All Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">User ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Created</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-muted-foreground">
                        {user.id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {user.full_name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      {user.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(user.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="text-primary hover:underline"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="text-muted-foreground hover:underline"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        Showing {users.length} user{users.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
