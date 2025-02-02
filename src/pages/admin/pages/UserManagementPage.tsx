import UserManagementContent from '../Content/UserManagementContent';

export default function UserManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Kullanıcı Yönetimi</h1>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <UserManagementContent />
        </div>
      </div>
    </div>
  );
}