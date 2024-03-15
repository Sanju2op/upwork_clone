import React, { useEffect } from 'react'

function AdminDashboard() {
  useEffect(() => {
    document.title = "Admin | Upwork - clone";
  }, []);

  return (
    <div>
      <h1>Welcome, admin</h1>
    </div>
  )
}

export default AdminDashboard
