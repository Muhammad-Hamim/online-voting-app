import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  IdCard,
  Loader2,
  Users,
  UserCheck,
  UserX,
  UserCog,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import moment from "moment";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useGetAllUser } from "@/hooks/useUserInfo";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/positions";
import { debounce } from "lodash";

const UserManagement = () => {
  const [axiosSecure] = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(100);

  const { users, isLoading, isError, refetch } = useGetAllUser({
    searchTerm,
    page: currentPage,
    limit: itemsPerPage,
  });
  const totalUsers = users?.length;
  const { register, handleSubmit } = useForm();

  // Debounce refetch function
  const debouncedRefetch = debounce(() => {
    refetch();
  }, 5000);

  const onSearchSubmit: SubmitHandler<{ searchTerm: string }> = (data) => {
    setSearchTerm(data.searchTerm);
    debouncedRefetch();
  };
  const updateUserMutation = useMutation({
    mutationFn: async ({
      email,
      updates,
    }: {
      email: string;
      updates: { role?: string; status?: string };
    }) => {
      await axiosSecure.patch(
        `/users/update-user-status-role/${email}`,
        updates
      );
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(error?.response?.data?.message);
    },
  });

  const handleRoleChange = (email: string, newRole: string) => {
    toast.promise(
      updateUserMutation.mutateAsync({ email, updates: { role: newRole } }),
      {
        loading: "updating...",
        success: "user role updated successfully",
        error: (error: AxiosError<ErrorResponse>) =>
          error.response?.data?.message || "Failed to update role!",
      }
    );
  };

  const handleStatusChange = (email: string, newStatus: string) => {
    toast.promise(
      updateUserMutation.mutateAsync({ email, updates: { status: newStatus } }),
      {
        loading: "updating...",
        success: "user status updated successfully",
        error: (error: AxiosError<ErrorResponse>) =>
          error.response?.data?.message || "Failed to update role!",
      }
    );
  };

  const userStats = {
    totalUsers: totalUsers,
    totalAdmins: users?.filter((user) => user.role === "admin").length || 0,
    totalSuperAdmins:
      users?.filter((user) => user.role === "superAdmin").length || 0,
    totalActiveUsers:
      users?.filter((user) => user.status === "active").length || 0,
    totalBlockedUsers:
      users?.filter((user) => user.status === "blocked").length || 0,
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        User Management Dashboard
      </h1>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalAdmins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.totalSuperAdmins}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.totalActiveUsers}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.totalBlockedUsers}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Create Admin Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <form
          onChange={handleSubmit(onSearchSubmit)}
          className="w-full md:w-1/2"
        >
          <div className="relative">
            <Input
              type="text"
              placeholder="Search users..."
              {...register("searchTerm")}
              className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <button
              type="submit"
              className="absolute inset-y-0 left-0 pl-3 flex items-center"
            >
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </form>
        <Button
          variant="outline"
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          Create Admin
        </Button>
      </div>

      {/* User Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      ) : isError ? (
        <div className="text-center py-10 text-red-500">
          Error loading users. Please try again.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <Table className="w-full bg-white">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user, index) => (
                <TableRow
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.photo}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs mt-1 ml-2"
                        >
                          <IdCard className="w-3 h-3 mr-1" />
                          {user.studentId}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap">
                    <Select
                      onValueChange={(value) =>
                        handleRoleChange(user.email, value)
                      }
                      defaultValue={user.role}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder={user.role} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="superAdmin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap">
                    <Select
                      onValueChange={(value) =>
                        handleStatusChange(user.email, value)
                      }
                      defaultValue={user.status}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder={user.status} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {moment(user.lastLogin).format("DD MMM YYYY, hh:mm:ss a")}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`user-details/${user.email}`}>
                      <Button variant="outline" className="mr-2">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
