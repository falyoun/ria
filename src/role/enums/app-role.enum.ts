export enum AppRole {
  SUPER_ADMIN = 'super_admin', // a person who can manage all organizations in the system
  ADMIN = 'admin', // Manage users ( CRUD on users ),
  PAYER = 'payer', // The one enters his bank credentials
  MANAGER = 'manager', // Manage invoices ( review, upload, reject, approve )
  TEAM_MEMBER = 'team_member', // Can upload invoices
}
