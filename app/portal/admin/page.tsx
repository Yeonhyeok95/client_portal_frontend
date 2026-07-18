"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import {
  createUser,
  deleteUser,
  fetchUsers,
  resetUserPassword,
  setUserEnabled,
  type AdminUser,
  type CreateUserInput,
} from "@/lib/admin";
import { clearAuthState, getAuthState, getUser } from "@/lib/portalAuth";

type RoleFilter = "ALL" | "CLIENT" | "ADVISOR" | "ADMIN";

/** 행 액션에서 띄우는 확인 모달의 종류. */
type PendingAction =
  | { type: "toggle"; user: AdminUser }
  | { type: "reset"; user: AdminUser }
  | { type: "delete"; user: AdminUser };

const ROLE_BADGE: Record<AdminUser["role"], string> = {
  CLIENT: "bg-blue/10 text-blue",
  ADVISOR: "bg-navy/10 text-navy",
  ADMIN: "bg-red/10 text-red",
};

const EMPTY_FORM: CreateUserInput = {
  email: "",
  displayName: "",
  role: "CLIENT",
  initialPassword: "",
};

export default function AdminConsolePage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [filter, setFilter] = useState<RoleFilter>("ALL");
  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateUserInput>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);

  const [action, setAction] = useState<PendingAction | null>(null);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [acting, setActing] = useState(false);

  useEffect(() => {
    if (getAuthState() === "signedin" && getUser()?.role === "ADMIN") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthorized(true);
    } else {
      router.replace("/portal/login");
    }
  }, [router]);

  useEffect(() => {
    if (!authorized) return;
    let cancelled = false;
    fetchUsers()
      .then((list) => {
        if (!cancelled) setUsers(list);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authorized]);

  function signOut() {
    clearAuthState();
    router.push("/portal/login");
  }

  function flash(message: string) {
    setNotice(message);
    setError("");
  }

  async function submitCreate() {
    if (creating) return;
    if (!form.email.trim() || !form.displayName.trim() || !form.initialPassword) {
      setFormError("Please fill in every field.");
      return;
    }
    if (form.initialPassword.length < 8) {
      setFormError("Initial password must be at least 8 characters.");
      return;
    }
    setCreating(true);
    setFormError("");
    try {
      const created = await createUser({
        ...form,
        email: form.email.trim(),
        displayName: form.displayName.trim(),
      });
      setUsers((prev) => [...prev, created]);
      setForm(EMPTY_FORM);
      setShowCreate(false);
      flash(`Account created for ${created.email}.`);
    } catch (e) {
      setFormError((e as Error).message);
    } finally {
      setCreating(false);
    }
  }

  async function runAction() {
    if (!action || acting) return;
    setActing(true);
    try {
      if (action.type === "toggle") {
        const updated = await setUserEnabled(action.user.id, !action.user.enabled);
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        flash(
          updated.enabled
            ? `${updated.email} has been re-enabled.`
            : `${updated.email} has been disabled. They can no longer sign in.`,
        );
      } else if (action.type === "reset") {
        await resetUserPassword(action.user.id);
        flash(`A temporary password has been emailed to ${action.user.email}.`);
      } else {
        await deleteUser(action.user.id);
        setUsers((prev) => prev.filter((u) => u.id !== action.user.id));
        flash(`${action.user.email} and all related data have been deleted.`);
      }
      setAction(null);
      setConfirmEmail("");
    } catch (e) {
      setError((e as Error).message);
      setNotice("");
      setAction(null);
      setConfirmEmail("");
    } finally {
      setActing(false);
    }
  }

  if (!authorized) return null;

  const me = getUser();
  const shown = users.filter((u) => {
    if (filter !== "ALL" && u.role !== filter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      u.email.toLowerCase().includes(q) ||
      u.displayName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen">
      <div className="px-6 sm:px-10 pt-5">
        <div className="max-w-[1280px] mx-auto bg-navy rounded-[34px] min-h-[60px] flex flex-wrap items-center justify-between gap-3 py-2 pl-7 pr-3.5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-bold text-[19px] text-white">TSAPtest</span>
            <span className="text-[11px] font-semibold tracking-[1.4px] text-white/45 uppercase">
              Admin console
            </span>
          </div>
          <div className="flex items-center gap-3.5">
            <span className="text-[13px] font-semibold text-white">
              {me?.name}
            </span>
            <button
              onClick={signOut}
              className="cursor-pointer text-xs font-bold text-white/55 px-3"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 pt-7.5 pb-15">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <h1 className="text-[26px] sm:text-[30px] font-bold text-navy">
            Account management
          </h1>
          <Button size="sm" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? "Close" : "Create account"}
          </Button>
        </div>

        {notice && (
          <div className="mb-4 text-[13px] font-semibold text-green">
            {notice}
          </div>
        )}
        {error && (
          <div className="mb-4 text-[13px] font-semibold text-red">{error}</div>
        )}

        {showCreate && (
          <div className="bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6.5 mb-5">
            <div className="text-sm font-bold text-navy mb-4">New account</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-navy">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  className="h-[44px] border border-line rounded-[5px] bg-offwhite-2 px-3.5 font-sans text-sm text-navy outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-navy">
                  Full name
                </label>
                <input
                  value={form.displayName}
                  onChange={(e) =>
                    setForm({ ...form, displayName: e.target.value })
                  }
                  placeholder="Jane Doe"
                  className="h-[44px] border border-line rounded-[5px] bg-offwhite-2 px-3.5 font-sans text-sm text-navy outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-navy">Role</label>
                {/* 역할은 생성 시 확정 — 이후 변경 기능은 제공하지 않는다 */}
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value as CreateUserInput["role"],
                    })
                  }
                  className="h-[44px] border border-line rounded-[5px] bg-offwhite-2 px-3 font-sans text-sm text-navy outline-none"
                >
                  <option value="CLIENT">Client</option>
                  <option value="ADVISOR">Advisor</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-navy">
                  Initial password
                </label>
                <input
                  type="password"
                  value={form.initialPassword}
                  onChange={(e) =>
                    setForm({ ...form, initialPassword: e.target.value })
                  }
                  placeholder="At least 8 characters"
                  className="h-[44px] border border-line rounded-[5px] bg-offwhite-2 px-3.5 font-sans text-sm text-navy outline-none"
                />
              </div>
            </div>
            {formError && (
              <div className="mt-3 text-[13px] font-semibold text-red">
                {formError}
              </div>
            )}
            <div className="mt-4">
              <Button size="sm" onClick={submitCreate} disabled={creating}>
                {creating ? "Creating…" : "Create"}
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          {(["ALL", "CLIENT", "ADVISOR", "ADMIN"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold ${
                filter === f ? "bg-navy text-white" : "bg-white text-body"
              }`}
            >
              {f === "ALL" ? "All roles" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email or name"
            className="ml-auto h-[38px] w-full sm:w-[260px] border border-line rounded-full bg-white px-4 font-sans text-[13px] text-navy outline-none"
          />
        </div>

        <div className="bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="hidden md:grid grid-cols-[52px_1.6fr_1.2fr_100px_92px_110px_270px] gap-3 items-center bg-offwhite py-3 px-5.5 text-[11px] font-bold tracking-[1px] uppercase text-muted">
            <span>ID</span>
            <span>Email</span>
            <span>Name</span>
            <span>Role</span>
            <span>Status</span>
            <span>Joined</span>
            <span className="text-right">Actions</span>
          </div>
          {loading && (
            <div className="py-8 px-6 text-[13px] font-semibold text-muted">
              Loading accounts…
            </div>
          )}
          {!loading && shown.length === 0 && (
            <div className="py-8 px-6 text-[13px] font-semibold text-muted">
              No accounts match.
            </div>
          )}
          {shown.map((u) => {
            const isSelf = u.email === me?.email;
            const locked = isSelf || u.role === "ADMIN";
            return (
              <div
                key={u.id}
                className="grid grid-cols-1 md:grid-cols-[52px_1.6fr_1.2fr_100px_92px_110px_270px] gap-1.5 md:gap-3 md:items-center border-t border-[rgb(237,237,237)] py-4 px-5.5"
              >
                <span className="text-[13px] font-semibold text-muted">
                  #{u.id}
                </span>
                <span className="text-sm font-bold text-navy break-all">
                  {u.email}
                  {isSelf && (
                    <span className="ml-2 text-[10px] font-bold text-muted uppercase">
                      you
                    </span>
                  )}
                </span>
                <span className="text-[13px] font-semibold text-body">
                  {u.displayName}
                </span>
                <span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${ROLE_BADGE[u.role]}`}
                  >
                    {u.role}
                  </span>
                </span>
                <span
                  className={`text-xs font-bold ${u.enabled ? "text-green" : "text-red"}`}
                >
                  {u.enabled ? "Active" : "Disabled"}
                </span>
                <span className="text-xs font-semibold text-muted">
                  {new Date(u.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="flex flex-wrap md:justify-end gap-2">
                  {/* 자기 자신·ADMIN 계정은 서버 가드와 동일하게 UI에서도 잠근다 */}
                  <button
                    onClick={() => setAction({ type: "toggle", user: u })}
                    disabled={locked}
                    className="cursor-pointer rounded-[5px] border border-line bg-white px-3 py-1.5 text-xs font-bold text-body disabled:opacity-40 disabled:cursor-default"
                  >
                    {u.enabled ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => setAction({ type: "reset", user: u })}
                    disabled={locked}
                    className="cursor-pointer rounded-[5px] border border-line bg-white px-3 py-1.5 text-xs font-bold text-body disabled:opacity-40 disabled:cursor-default"
                  >
                    Reset password
                  </button>
                  <button
                    onClick={() => {
                      setConfirmEmail("");
                      setAction({ type: "delete", user: u });
                    }}
                    disabled={locked}
                    className="cursor-pointer rounded-[5px] border border-red/40 bg-white px-3 py-1.5 text-xs font-bold text-red disabled:opacity-40 disabled:cursor-default"
                  >
                    Delete
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-6">
          <div className="w-full max-w-[440px] bg-white rounded-[10px] shadow-[0_6px_24px_rgba(0,0,0,0.2)] p-7">
            {action.type === "toggle" && (
              <>
                <div className="text-base font-bold text-navy">
                  {action.user.enabled ? "Disable" : "Enable"} this account?
                </div>
                <p className="mt-2.5 text-[13px] leading-[1.55] text-body">
                  {action.user.enabled
                    ? `${action.user.email} will no longer be able to sign in. Their data is kept and the account can be re-enabled later.`
                    : `${action.user.email} will be able to sign in again.`}
                </p>
              </>
            )}
            {action.type === "reset" && (
              <>
                <div className="text-base font-bold text-navy">
                  Reset this password?
                </div>
                <p className="mt-2.5 text-[13px] leading-[1.55] text-body">
                  A temporary password will be generated and sent to{" "}
                  <span className="font-bold">{action.user.email}</span>. The
                  password is never shown here.
                </p>
              </>
            )}
            {action.type === "delete" && (
              <>
                <div className="text-base font-bold text-red">
                  Permanently delete this account?
                </div>
                <p className="mt-2.5 text-[13px] leading-[1.55] text-body">
                  This deletes <span className="font-bold">{action.user.email}</span>{" "}
                  along with their portfolio data and chat history.{" "}
                  <span className="font-bold">This cannot be undone.</span> If you
                  only need to block sign-in, use Disable instead.
                </p>
                <p className="mt-3 text-[13px] font-bold text-navy">
                  Type the account email to confirm
                </p>
                <input
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder={action.user.email}
                  className="mt-1.5 w-full h-[44px] border border-line rounded-[5px] bg-offwhite-2 px-3.5 font-sans text-sm text-navy outline-none"
                />
              </>
            )}
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => {
                  setAction(null);
                  setConfirmEmail("");
                }}
                className="cursor-pointer rounded-[5px] border border-line bg-white px-4 py-2.5 text-[13px] font-bold text-body"
              >
                Cancel
              </button>
              <button
                onClick={runAction}
                disabled={
                  acting ||
                  (action.type === "delete" &&
                    confirmEmail.trim().toLowerCase() !==
                      action.user.email.toLowerCase())
                }
                className={`cursor-pointer rounded-[5px] px-4 py-2.5 text-[13px] font-bold text-white disabled:opacity-40 disabled:cursor-default ${
                  action.type === "delete" ? "bg-red" : "bg-blue"
                }`}
              >
                {acting
                  ? "Working…"
                  : action.type === "delete"
                    ? "Delete permanently"
                    : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
