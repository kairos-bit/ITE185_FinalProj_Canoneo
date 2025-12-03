import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

const ROLES = ["Photojournalist", "Videojournalist", "Writer", "Manager"];
const MEDIA_ROLES = ["Photojournalist", "Videojournalist"];

function getInitials(name) {
  if (!name) return "S";
  const parts = name.trim().split(/\s+/);
  const initials = parts.map((p) => p[0].toUpperCase()).join("");
  return initials.slice(0, 2);
}

// Navbar button with "active" highlight
function NavItem({ to, label }) {
  const location = useLocation();
  const isMembers =
    to === "/members" &&
    (location.pathname === "/" || location.pathname.startsWith("/members"));
  const isActive =
    isMembers || (to !== "/members" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          padding: "8px 10px",
          borderRadius: 999,
          border: isActive ? "none" : "1px solid #374151",
          background: isActive
            ? "linear-gradient(90deg, #F97316, #EC4899, #6366F1)"
            : "transparent",
          color: isActive ? "white" : "#9CA3AF",
          fontSize: 13,
          fontWeight: isActive ? 600 : 500,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {label}
      </div>
    </Link>
  );
}

function App() {
  // Shared member list for all pages
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState("");

  useEffect(() => {
  async function loadMembers() {
    try {
      setLoadingMembers(true);
      setMembersError("");

      // artificial delay so we can SEE the loading text
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const res = await fetch("http://localhost:4000/api/members");
      if (!res.ok) {
        throw new Error("Failed to fetch members");
      }
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
      setMembersError("Could not load members from the server.");
    } finally {
      setLoadingMembers(false);
    }
  }

  loadMembers();
}, []);


  // Shared tasks list
   // Shared tasks list (from DB)
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState("");
    useEffect(() => {
    async function loadTasks() {
      try {
        setLoadingTasks(true);
        setTasksError("");

        const res = await fetch("http://localhost:4000/api/tasks");
        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
        setTasksError("Could not load tasks from the server.");
      } finally {
        setLoadingTasks(false);
      }
    }

    loadTasks();
  }, []);


  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        color: "#E5E7EB",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top header */}
      <header
        style={{
          height: 64,
          padding: "0 24px",
          borderBottom: "1px solid #1F2933",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "linear-gradient(90deg, #0F172A 0%, #111827 40%, #1E293B 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background:
                "linear-gradient(135deg, #F97316, #EC4899, #6366F1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            S
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            Silahis Publication
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", textAlign: "right" }}>
            Student Journalist Organization · Member & Task Manager
          </div>
        </div>
      </header>

      {/* Layout: sidebar + page content */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <aside
          style={{
            width: 220,
            borderRight: "1px solid #1F2933",
            padding: "20px 16px",
            backgroundColor: "#020617",
          }}
        >
          <span
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "#6B7280",
              marginBottom: 8,
              display: "block",
            }}
          >
            Navigation
          </span>

          <NavItem to="/members" label="Members" />
          <NavItem to="/tasks" label="Tasks" />
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/about" label="About Silahis" />

          <div
            style={{
              marginTop: 24,
              padding: 12,
              borderRadius: 12,
              border: "1px dashed #4B5563",
              fontSize: 12,
              color: "#9CA3AF",
            }}
          >
            Tasks page assigns writers and photo/video journalists to coverage
            assignments.
          </div>
        </aside>

        <main
          style={{
            flex: 1,
            padding: "24px 24px 32px",
            overflowY: "auto",
          }}
        >
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Routes>
  {/* Home defaults to Members */}
  <Route
  path="/"
  element={
    <MembersPage
      members={members}
      setMembers={setMembers}
      loadingMembers={loadingMembers}
      membersError={membersError}
      tasks={tasks}
    />
  }
/>

<Route
  path="/members"
  element={
    <MembersPage
      members={members}
      setMembers={setMembers}
      loadingMembers={loadingMembers}
      membersError={membersError}
      tasks={tasks}
    />
  }
/>
  {/* Tasks dashboard */}
   <Route
    path="/tasks"
    element={
      <TaskDashboardPage
        members={members}
        tasks={tasks}
        setTasks={setTasks}
        loadingTasks={loadingTasks}
        tasksError={tasksError}
      />
    }
  />

  {/* Role statistics */}
  <Route
    path="/dashboard"
    element={<DashboardPage members={members} />}
  />

  {/* Member profile */}
  <Route
  path="/profile/:idNumber"
  element={
    <ProfilePage
      members={members}
      loadingMembers={loadingMembers}
      membersError={membersError}
      tasks={tasks}
    />
  }
/>


  {/* About Silahis */}
  <Route path="/about" element={<AboutPage />} />

  {/* Fallback: send unknown paths back to Members */}
  
<Route
  path="*"
  element={
    <MembersPage
      members={members}
      setMembers={setMembers}
      loadingMembers={loadingMembers}
      membersError={membersError}
      tasks={tasks}
    />
  }
/>
</Routes>


          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- MEMBERS PAGE (CRUD) ---------- */

function MembersPage({
  members,
  setMembers,
  loadingMembers,
  membersError,
  tasks = [],
}) {

  const [idNumber, setIdNumber] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [memberSearch, setMemberSearch] = useState("");

  const resetForm = () => {
    setIdNumber("");
    setName("");
    setRole(ROLES[0]);
    setProfileImage(null);
    setIsEditing(false);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!idNumber.trim() || !name.trim()) {
    setError("ID number and name are required.");
    return;
  }

  try {
    if (!isEditing) {
      // CREATE (POST /api/members)
      const res = await fetch("http://localhost:4000/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idNumber,
          name,
          role,
          profileImage,
        }),
      });

      if (res.status === 409) {
        const body = await res.json();
        setError(body.error || "ID number already exists.");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to add member");
      }

      const created = await res.json();
      setMembers((prev) => [...prev, created]);
      resetForm();
    } else {
      // UPDATE (PUT /api/members/:idNumber)
      const res = await fetch(
        `http://localhost:4000/api/members/${editingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newIdNumber: idNumber,
            name,
            role,
            profileImage,
          }),
        }
      );

      if (res.status === 409) {
        const body = await res.json();
        setError(body.error || "Another member uses that ID.");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to update member");
      }

      const updated = await res.json();
      setMembers((prev) =>
        prev.map((m) =>
          m.idNumber === editingId ? updated : m
        )
      );
      resetForm();
    }
  } catch (err) {
    console.error(err);
    setError("Something went wrong. Please try again.");
  }
};

  const handleEdit = (member) => {
    setIsEditing(true);
    setEditingId(member.idNumber);
    setIdNumber(member.idNumber);
    setName(member.name);
    setRole(member.role);
    setProfileImage(member.profileImage || null);
    setError("");
  };

  const handleDelete = async (idToDelete) => {
  if (!window.confirm("Delete this member?")) return;

  try {
    const res = await fetch(
      `http://localhost:4000/api/members/${idToDelete}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      throw new Error("Failed to delete member");
    }

    setMembers((prev) => prev.filter((m) => m.idNumber !== idToDelete));
    if (isEditing && editingId === idToDelete) {
      resetForm();
    }
  } catch (err) {
    console.error(err);
    alert("Could not delete member. Please try again.");
  }
};

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => setProfileImage(null);

  const normalizedSearch = memberSearch.trim().toLowerCase();

const filteredMembers = normalizedSearch
  ? members.filter((m) => {
      const id = m.idNumber?.toLowerCase() || "";
      const name = m.name?.toLowerCase() || "";
      const roleValue = m.role?.toLowerCase() || "";
      return (
        id.includes(normalizedSearch) ||
        name.includes(normalizedSearch) ||
        roleValue.includes(normalizedSearch)
      );
    })
  : members;


  return (
  <>
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 6 }}>Silahis Members</h1>
      <p style={{ color: "#9CA3AF", maxWidth: 620, fontSize: 14 }}>
        Manage accounts for Silahis student journalists. Add, view, update,
        and delete members with roles, ID numbers, and profile photos.
      </p>
    </div>

    {loadingMembers && (
      <p style={{ color: "#9CA3AF", marginBottom: 8, fontSize: 14 }}>
        Loading members from the server…
      </p>
    )}

    {membersError && (
      <p style={{ color: "#F97316", marginBottom: 8, fontSize: 14 }}>
        {membersError}
      </p>
    )}

    {/* Form */}
    <section
      style={{
        backgroundColor: "#020617",
        borderRadius: 12,
        padding: 20,
        border: "1px solid #374151",
      }}
    >

        <h2 style={{ fontSize: 20, marginBottom: 12 }}>
          {isEditing ? "Edit Member" : "Add New Member"}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 16,
            alignItems: "flex-start",
          }}
        >
          {/* Left side: fields */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: 4, fontSize: 14 }}>
                ID Number <span style={{ color: "#F97316" }}>*</span>
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="e.g. 2023-001"
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid #4B5563",
                  backgroundColor: "#020617",
                  color: "white",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: 4, fontSize: 14 }}>
                Full Name <span style={{ color: "#F97316" }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Member name"
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid #4B5563",
                  backgroundColor: "#020617",
                  color: "white",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: 4, fontSize: 14 }}>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid #4B5563",
                  backgroundColor: "#020617",
                  color: "white",
                }}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <button
                type="submit"
                style={{
                  padding: "10px 18px",
                  borderRadius: 999,
                  border: "none",
                  background:
                    "linear-gradient(90deg, #F97316, #EC4899, #6366F1)",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {isEditing ? "Save Changes" : "Add Member"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 999,
                    border: "1px solid #4B5563",
                    backgroundColor: "transparent",
                    color: "#E5E7EB",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Right side: profile photo */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ marginBottom: 4, fontSize: 14 }}>
              Profile Photo
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #4B5563",
                  backgroundColor: "#020617",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#9CA3AF",
                }}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span>{getInitials(name)}</span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  style={{ fontSize: 12, marginBottom: 6 }}
                />
                {profileImage && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 999,
                      border: "1px solid #4B5563",
                      backgroundColor: "transparent",
                      color: "#E5E7EB",
                      fontSize: 11,
                      cursor: "pointer",
                      width: "fit-content",
                    }}
                  >
                    Remove photo
                  </button>
                )}
                <span
                  style={{
                    fontSize: 11,
                    color: "#6B7280",
                    marginTop: 2,
                  }}
                >
                  Optional. JPG/PNG, small images only (demo storage).
                </span>
              </div>
            </div>
          </div>
        </form>

        {error && (
          <p style={{ color: "#F97316", marginTop: 8, fontSize: 14 }}>
            {error}
          </p>
        )}
      </section>

      {/* Table */}
      <section
        style={{
          backgroundColor: "#020617",
          borderRadius: 12,
          padding: 20,
          border: "1px solid #374151",
        }}
      >
       <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
    gap: 12,
  }}
>
  <div>
    <h2 style={{ fontSize: 20, marginBottom: 2 }}>Current Members</h2>
    <span style={{ fontSize: 13, color: "#9CA3AF" }}>
      Total: {members.length}
    </span>
  </div>

  <input
    type="text"
    value={memberSearch}
    onChange={(e) => setMemberSearch(e.target.value)}
    placeholder="Search by ID, name, or role…"
    style={{
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid #4B5563",
      backgroundColor: "#020617",
      color: "#E5E7EB",
      fontSize: 12,
      minWidth: 220,
    }}
  />
</div>


        {members.length === 0 ? (
          <p style={{ color: "#9CA3AF", fontSize: 14 }}>
            No members yet. Use the form above to add the first Silahis member.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
             <thead>
  <tr style={{ backgroundColor: "#030712" }}>
    <th
      style={{
        textAlign: "left",
        padding: "8px",
        borderBottom: "1px solid #374151",
      }}
    >
      ID Number
    </th>
    <th
      style={{
        textAlign: "left",
        padding: "8px",
        borderBottom: "1px solid #374151",
      }}
    >
      Name
    </th>
    <th
      style={{
        textAlign: "left",
        padding: "8px",
        borderBottom: "1px solid #374151",
      }}
    >
      Role
    </th>
    <th
      style={{
        textAlign: "left",
        padding: "8px",
        borderBottom: "1px solid #374151",
      }}
    >
      Current Tasks
    </th>
    <th
      style={{
        textAlign: "right",
        padding: "8px",
        borderBottom: "1px solid #374151",
      }}
    >
      Actions
    </th>
  </tr>
</thead>
<tbody>
  {filteredMembers.length === 0 ? (
    <tr>
      <td
        colSpan={5}
        style={{
          padding: "10px",
          textAlign: "center",
          fontSize: 13,
          color: "#9CA3AF",
          borderBottom: "1px solid #111827",
        }}
      >
        No members match your search.
      </td>
    </tr>
  ) : (
    filteredMembers.map((member) => {
      // Find tasks where this member is involved (as writer or media)
      const memberTasks = tasks.filter(
        (t) =>
          t.writerId === member.idNumber || t.mediaId === member.idNumber
      );

      return (
        <tr key={member.idNumber}>
          {/* ID Number */}
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid #111827",
            }}
          >
            {member.idNumber}
          </td>

          {/* Name + avatar */}
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid #111827",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "1px solid #4B5563",
                  backgroundColor: "#020617",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#9CA3AF",
                }}
              >
                {member.profileImage ? (
                  <img
                    src={member.profileImage}
                    alt={member.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span>{getInitials(member.name)}</span>
                )}
              </div>
              <span>{member.name}</span>
            </div>
          </td>

          {/* Role */}
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid #111827",
            }}
          >
            {member.role}
          </td>

          {/* Current Tasks */}
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid #111827",
            }}
          >
            {memberTasks.length === 0 ? (
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>—</span>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  fontSize: 12,
                  color: "#9CA3AF",
                }}
              >
                {memberTasks.map((task) => {
                  const roleLabel =
                    task.writerId === member.idNumber ? "Writer" : "Media";
                  return (
                    <span key={task.id}>
                      <strong>{task.title}</strong>{" "}
                      <span style={{ color: "#6B7280" }}>
                        ({roleLabel} · {task.status})
                      </span>
                    </span>
                  );
                })}
              </div>
            )}
          </td>

          {/* Actions */}
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid #111827",
              textAlign: "right",
            }}
          >
            <button
              onClick={() => navigate(`/profile/${member.idNumber}`)}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid #4B5563",
                backgroundColor: "transparent",
                color: "#E5E7EB",
                fontSize: 12,
                cursor: "pointer",
                marginRight: 6,
              }}
            >
              View
            </button>
            <button
              onClick={() => handleEdit(member)}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid #4B5563",
                backgroundColor: "transparent",
                color: "#E5E7EB",
                fontSize: 12,
                cursor: "pointer",
                marginRight: 6,
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(member.idNumber)}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid #DC2626",
                backgroundColor: "#7F1D1D",
                color: "white",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    })
  )}
</tbody>


            </table>
          </div>
        )}
      </section>
    </>
  );
}

/* ---------- TASK DASHBOARD PAGE ---------- */

function TaskDashboardPage({
  members,
  tasks,
  setTasks,
  loadingTasks,
  tasksError,
}) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [writerId, setWriterId] = useState("");
  const [mediaId, setMediaId] = useState("");
  const [status, setStatus] = useState("Planned");
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");


  const [isEditing, setIsEditing] = useState(false);
const [editingId, setEditingId] = useState(null);

const resetForm = () => {
  setTitle("");
  setDescription("");
  setWriterId("");
  setMediaId("");
  setStatus("Planned");
  setIsEditing(false);
  setEditingId(null);
  setError("");
};
  const handleEdit = (task) => {
    setIsEditing(true);
    setEditingId(task.id);
    setTitle(task.title || "");
    setDescription(task.description || "");
    setWriterId(task.writerId || "");
    setMediaId(task.mediaId || "");
    setStatus(task.status || "Planned");
    setError("");

    // optional: scroll up so the form is visible
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const writerOptions = members.filter((m) => m.role === "Writer");
  const mediaOptions = members.filter((m) =>
    MEDIA_ROLES.includes(m.role)
  );

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }
    if (!writerId || !mediaId) {
      setError("Please assign both a writer and a photo/video journalist.");
      return;
    }

    try {
      if (!isEditing) {
        // CREATE -> POST /api/tasks
        const res = await fetch("http://localhost:4000/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            writerId,
            mediaId,
            status,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to add task");
        }

        const created = await res.json();
        setTasks((prev) => [created, ...prev]); // newest first
      } else {
        // UPDATE -> PUT /api/tasks/:id
        const res = await fetch(
          `http://localhost:4000/api/tasks/${editingId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              description,
              writerId,
              mediaId,
              status,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to update task");
        }

        const updated = await res.json();
        setTasks((prev) =>
          prev.map((t) => (t.id === editingId ? { ...t, ...updated } : t))
        );
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving the task.");
    }
  };


    const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (isEditing && editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      alert("Could not delete task. Please try again.");
    }
  };


  const getMemberName = (id) =>
    members.find((m) => m.idNumber === id)?.name || "Unknown / removed";

  const getMemberRole = (id) =>
    members.find((m) => m.idNumber === id)?.role || "—";

  const filteredTasks = tasks.filter((task) => {
    // Status filter
    if (statusFilter !== "All" && task.status !== statusFilter) return false;

    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    const titleText = (task.title || "").toLowerCase();
    const statusText = (task.status || "").toLowerCase();
    const writerName = getMemberName(task.writerId).toLowerCase();
    const mediaName = getMemberName(task.mediaId).toLowerCase();

    return (
      titleText.includes(q) ||
      statusText.includes(q) ||
      writerName.includes(q) ||
      mediaName.includes(q)
    );
  });

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, marginBottom: 6 }}>Task Dashboard</h1>
        <p style={{ color: "#9CA3AF", maxWidth: 620, fontSize: 14 }}>
          Create coverage tasks and assign a writer plus a photo/video
          journalist from the existing Silahis members.
        </p>
         {/* Insert loading + error here */}
    {loadingTasks && (
  <p style={{ color: "#9CA3AF", marginBottom: 8, fontSize: 14 }}>
    Loading tasks from the server…
  </p>
)}

{tasksError && (
  <p style={{ color: "#F97316", marginBottom: 8, fontSize: 14 }}>
    {tasksError}
  </p>
)}


    {/* The rest of the form and table goes here… */} 
      </div>

      <section
        style={{
          backgroundColor: "#020617",
          borderRadius: 12,
          padding: 20,
          border: "1px solid #374151",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Add New Task</h2>

        {writerOptions.length === 0 || mediaOptions.length === 0 ? (
          <p style={{ color: "#F97316", fontSize: 14 }}>
            You need at least one member with role{" "}
            <strong>Writer</strong> and one with role{" "}
            <strong>Photojournalist</strong> or{" "}
            <strong>Videojournalist</strong> before you can assign tasks.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: 4, fontSize: 14 }}>
                  Task Title <span style={{ color: "#F97316" }}>*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Intramurals Opening Coverage"
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #4B5563",
                    backgroundColor: "#020617",
                    color: "white",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: 4, fontSize: 14 }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Short description of the coverage task..."
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #4B5563",
                    backgroundColor: "#020617",
                    color: "white",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <div
                  style={{ display: "flex", flexDirection: "column", flex: 1 }}
                >
                  <label style={{ marginBottom: 4, fontSize: 14 }}>
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid #4B5563",
                      backgroundColor: "#020617",
                      color: "white",
                    }}
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: 8,
                  padding: "10px 18px",
                  borderRadius: 999,
                  border: "none",
                  background:
                    "linear-gradient(90deg, #F97316, #EC4899, #6366F1)",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "fit-content",
                }}
              >
              {isEditing ? "Save Changes" : "Add Task"}
              </button>

            </div>

            {/* Right side: assignment */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: 4, fontSize: 14 }}>
                  Writer <span style={{ color: "#F97316" }}>*</span>
                </label>
                <select
                  value={writerId}
                  onChange={(e) => setWriterId(e.target.value)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #4B5563",
                    backgroundColor: "#020617",
                    color: "white",
                  }}
                >
                  <option value="">Select writer…</option>
                  {writerOptions.map((m) => (
                    <option key={m.idNumber} value={m.idNumber}>
                      {m.name} ({m.idNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: 4, fontSize: 14 }}>
                  Photo/Video Journalist{" "}
                  <span style={{ color: "#F97316" }}>*</span>
                </label>
                <select
                  value={mediaId}
                  onChange={(e) => setMediaId(e.target.value)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #4B5563",
                    backgroundColor: "#020617",
                    color: "white",
                  }}
                >
                  <option value="">Select photo/video…</option>
                  {mediaOptions.map((m) => (
                    <option key={m.idNumber} value={m.idNumber}>
                      {m.name} – {m.role}
                    </option>
                  ))}
                </select>
              </div>

              <span style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
                Writers can only be members with role &quot;Writer&quot;.
                Photo/Video journalist must be &quot;Photojournalist&quot; or
                &quot;Videojournalist&quot;.
              </span>
            </div>
          </form>
        )}

        {error && (
          <p style={{ color: "#F97316", marginTop: 8, fontSize: 14 }}>
            {error}
          </p>
        )}
      </section>

      {/* Task list */}
      <section
        style={{
          backgroundColor: "#020617",
          borderRadius: 12,
          padding: 20,
          border: "1px solid #374151",
        }}
      >
         <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 12,
      alignItems: "center",
      gap: 12,
    }}
  >
    <h2 style={{ fontSize: 20 }}>Current Tasks</h2>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 6,
      }}
    >
      <span style={{ fontSize: 14, color: "#9CA3AF" }}>
        Showing: {filteredTasks.length} / {tasks.length}
      </span>

      <div style={{ display: "flex", gap: 8 }}>
        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid #4B5563",
            backgroundColor: "#020617",
            color: "white",
            fontSize: 12,
          }}
        >
          <option value="All">All status</option>
          <option value="Planned">Planned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search title, writer, status…"
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid #4B5563",
            backgroundColor: "#020617",
            color: "white",
            fontSize: 12,
            minWidth: 220,
          }}
        />
      </div>
    </div>
  </div>


        {filteredTasks.length === 0 ? (
  <p style={{ color: "#9CA3AF", fontSize: 14 }}>
    No tasks match your filters/search. Try changing the status filter or
    clearing the search box.
  </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#030712" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      borderBottom: "1px solid #374151",
                    }}
                  >
                    Title
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      borderBottom: "1px solid #374151",
                    }}
                  >
                    Writer
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      borderBottom: "1px solid #374151",
                    }}
                  >
                    Photo/Video
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      borderBottom: "1px solid #374151",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      borderBottom: "1px solid #374151",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #111827",
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>{task.title}</div>
                      {task.description && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "#9CA3AF",
                            marginTop: 2,
                          }}
                        >
                          {task.description}
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #111827",
                      }}
                    >
                      <div style={{ fontSize: 13 }}>
                        {getMemberName(task.writerId)}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#6B7280",
                          marginTop: 2,
                        }}
                      >
                        {getMemberRole(task.writerId)}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #111827",
                      }}
                    >
                      <div style={{ fontSize: 13 }}>
                        {getMemberName(task.mediaId)}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#6B7280",
                          marginTop: 2,
                        }}
                      >
                        {getMemberRole(task.mediaId)}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #111827",
                      }}
                    >
                      {task.status}
                    </td>
                    <td
                        style={{
                          padding: "8px",
                          borderBottom: "1px solid #111827",
                          textAlign: "right",
                        }}
                      >
                        <button
                          onClick={() => handleEdit(task)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 999,
                            border: "1px solid #4B5563",
                            backgroundColor: "transparent",
                            color: "#E5E7EB",
                            fontSize: 12,
                            cursor: "pointer",
                            marginRight: 6,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 999,
                            border: "1px solid #DC2626",
                            backgroundColor: "#7F1D1D",
                            color: "white",
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>

                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

/* ---------- DASHBOARD PAGE ---------- */

/* ---------- DASHBOARD PAGE ---------- */

function DashboardPage({ members }) {
  const [activeRole, setActiveRole] = useState(null);

  const counts = ROLES.reduce((acc, role) => ({ ...acc, [role]: 0 }), {});
  members.forEach((m) => {
    if (counts[m.role] !== undefined) counts[m.role] += 1;
  });

  const total = members.length || 1;

  const activeMembers =
    activeRole === null
      ? []
      : members.filter((m) => m.role === activeRole);

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, marginBottom: 6 }}>Dashboard</h1>
        <p style={{ color: "#9CA3AF", maxWidth: 620, fontSize: 14 }}>
          Quick overview of how many Silahis members you have in each role.
        </p>
      </div>

      <section
        style={{
          backgroundColor: "#020617",
          borderRadius: 12,
          padding: 20,
          border: "1px solid #374151",
        }}
      >
        {/* Role cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {ROLES.map((role) => {
            const count = counts[role];
            const percent = Math.round((count / total) * 100);
            const isActive = activeRole === role;

            return (
              <div
                key={role}
                onClick={() =>
                  setActiveRole((prev) => (prev === role ? null : role))
                }
                style={{
                  padding: 16,
                  borderRadius: 12,
                  border: isActive
                    ? "1px solid #F97316"
                    : "1px solid #374151",
                  backgroundColor: isActive ? "#020314" : "#020617",
                  cursor: "pointer",
                  transition: "border 0.15s ease, background-color 0.15s ease",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#9CA3AF",
                    marginBottom: 4,
                  }}
                >
                  {role}
                </div>
                <div
                  style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}
                >
                  {count}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#6B7280",
                    marginBottom: 8,
                  }}
                >
                  {percent}% of total members
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: "#111827",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: "100%",
                      background:
                        "linear-gradient(90deg, #F97316, #EC4899, #6366F1)",
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 11,
                    color: "#6B7280",
                  }}
                >
                  {isActive
                    ? "Click to hide members"
                    : "Click to view members"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Members list for the selected role */}
        {activeRole && (
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: 16 }}>
                {activeRole} Members ({activeMembers.length})
              </h2>
              <button
                onClick={() => setActiveRole(null)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: "1px solid #4B5563",
                  backgroundColor: "transparent",
                  color: "#E5E7EB",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>

            {activeMembers.length === 0 ? (
              <p style={{ fontSize: 13, color: "#9CA3AF" }}>
                No members with this role yet.
              </p>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {activeMembers.map((m) => (
                  <li
                    key={m.idNumber}
                    style={{
                      padding: "6px 8px",
                      borderRadius: 8,
                      border: "1px solid #111827",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: 13,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: "1px solid #4B5563",
                          backgroundColor: "#020617",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#9CA3AF",
                        }}
                      >
                        {m.profileImage ? (
                          <img
                            src={m.profileImage}
                            alt={m.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span>{getInitials(m.name)}</span>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{m.name}</div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#6B7280",
                          }}
                        >
                          ID: {m.idNumber}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </>
  );
}


/* ---------- PROFILE PAGE ---------- */

function ProfilePage({ members, loadingMembers, membersError, tasks = [] }) {

const { idNumber } = useParams();
const navigate = useNavigate();

const member = members.find((m) => m.idNumber === idNumber);

// show loading while members are being fetched
if (loadingMembers) {
  return (
    <div>
      <button
        onClick={() => navigate("/members")}
        style={{
          padding: "6px 12px",
          borderRadius: 999,
          border: "1px solid #4B5563",
          backgroundColor: "transparent",
          color: "#E5E7EB",
          fontSize: 12,
          cursor: "pointer",
          marginBottom: 16,
        }}
      >
        ← Back to Members
      </button>
      <p style={{ color: "#9CA3AF", fontSize: 14 }}>
        Loading member details…
      </p>
    </div>
  );
}

// handle error loading members
if (membersError) {
  return (
    <div>
      <button
        onClick={() => navigate("/members")}
        style={{
          padding: "6px 12px",
          borderRadius: 999,
          border: "1px solid #4B5563",
          backgroundColor: "transparent",
          color: "#E5E7EB",
          fontSize: 12,
          cursor: "pointer",
          marginBottom: 16,
        }}
      >
        ← Back to Members
      </button>
      <p style={{ color: "#F97316", fontSize: 14 }}>{membersError}</p>
    </div>
  );
}

// if no member with that id
if (!member) {
  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Member not found</h1>
      <p style={{ color: "#9CA3AF", marginBottom: 16 }}>
        The member with ID <code>{idNumber}</code> does not exist.
      </p>
      <button
        onClick={() => navigate("/members")}
        style={{
          padding: "8px 16px",
          borderRadius: 999,
          border: "1px solid #4B5563",
          backgroundColor: "transparent",
          color: "#E5E7EB",
          cursor: "pointer",
        }}
      >
        Back to Members
      </button>
    </div>
  );
}

const memberTasks = tasks.filter(
  (t) => t.writerId === member.idNumber || t.mediaId === member.idNumber
);


  return (
  <>
    <button
      onClick={() => navigate("/members")}
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        border: "1px solid #4B5563",
        backgroundColor: "transparent",
        color: "#E5E7EB",
        fontSize: 12,
        cursor: "pointer",
        marginBottom: 16,
      }}
    >
      ← Back to Members
    </button>

    <section
      style={{
        backgroundColor: "#020617",
        borderRadius: 12,
        padding: 24,
        border: "1px solid #374151",
        display: "flex",
        gap: 24,
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          overflow: "hidden",
          border: "3px solid #4B5563",
          backgroundColor: "#020617",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
          fontWeight: 700,
          color: "#9CA3AF",
        }}
      >
        {member.profileImage ? (
          <img
            src={member.profileImage}
            alt={member.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span>{getInitials(member.name)}</span>
        )}
      </div>

      <div>
        <h1 style={{ fontSize: 28, marginBottom: 4 }}>{member.name}</h1>
        <div
          style={{
            fontSize: 14,
            color: "#9CA3AF",
            marginBottom: 8,
          }}
        >
          ID Number: {member.idNumber}
        </div>
        <div
          style={{
            display: "inline-block",
            padding: "4px 10px",
            borderRadius: 999,
            border: "1px solid #4B5563",
            fontSize: 12,
            color: "#E5E7EB",
            marginBottom: 12,
          }}
        >
          {member.role}
        </div>

        <p style={{ fontSize: 14, color: "#9CA3AF", maxWidth: 500 }}>
          This is the profile view for the selected Silahis member. Later you
          can extend this page with more details such as contact info, sample
          works, or assignment history.
        </p>

        {/* Current assignments block */}
        <div style={{ marginTop: 20 }}>
          <h2
            style={{
              fontSize: 16,
              marginBottom: 6,
              color: "#E5E7EB",
            }}
          >
            Current Assignments
          </h2>

          {memberTasks.length === 0 ? (
            <p style={{ fontSize: 13, color: "#6B7280" }}>
              This member has no assigned tasks yet.
            </p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: 13,
                color: "#E5E7EB",
              }}
            >
              {memberTasks.map((task) => {
                const roleLabel =
                  task.writerId === member.idNumber ? "Writer" : "Media";
                return (
                  <li
                    key={task.id}
                    style={{
                      padding: "6px 0",
                      borderBottom: "1px solid #111827",
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{task.title}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                      {roleLabel} · {task.status}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  </>
);

}

/* ---------- ABOUT PAGE ---------- */

function AboutPage() {
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, marginBottom: 6 }}>About Silahis</h1>
        <p style={{ color: "#9CA3AF", maxWidth: 620, fontSize: 14 }}>
          This page is a placeholder for information about Silahis, the student
          journalist publication. You can customize this content based on your
          organization&apos;s history, mission, and achievements.
        </p>
      </div>

      <section
        style={{
          backgroundColor: "#020617",
          borderRadius: 12,
          padding: 20,
          border: "1px solid #374151",
          fontSize: 14,
          color: "#E5E7EB",
        }}
      >
        <p style={{ marginBottom: 12 }}>
          Silahis serves as a voice for the student body, documenting campus
          events through news, features, photojournalism, and video stories. The
          publication gives students hands-on experience in writing, editing,
          design, and media production.
        </p>
        <p style={{ marginBottom: 12 }}>
          In this demo app, the Members page shows how you can manage the
          publication&apos;s staff, while the Dashboard, Tasks, and Profile
          pages help visualize and organize member information and assignments.
        </p>
        <p>
          You can extend this app with more features such as article
          submissions, editorial workflows, or event coverage tracking.
        </p>
      </section>
    </>
  );
}

export default App;
