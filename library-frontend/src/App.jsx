import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import AdminRoute from './routes/AdminRoute.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AddEditBookPage from './pages/AddEditBookPage.jsx';
import AdminBooksPage from './pages/AdminBooksPage.jsx';
import AdminBorrowPage from './pages/AdminBorrowPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import BookDetailPage from './pages/BookDetailPage.jsx';
import BooksPage from './pages/BooksPage.jsx';
import BorrowedPage from './pages/BorrowedPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/borrowed" element={<ProtectedRoute element={<BorrowedPage />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        <Route
          path="/admin"
          element={<AdminRoute element={<AdminDashboardPage />} />}
        />
        <Route path="/admin/users" element={<AdminRoute element={<AdminUsersPage />} />} />
        <Route path="/admin/books" element={<AdminRoute element={<AdminBooksPage />} />} />
        <Route path="/admin/borrows" element={<AdminRoute element={<AdminBorrowPage />} />} />
        <Route path="/admin/books/new" element={<AdminRoute element={<AddEditBookPage />} />} />
        <Route path="/admin/books/:id/edit" element={<AdminRoute element={<AddEditBookPage />} />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
