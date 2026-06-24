"use client";
import ProfileSkeleton from "@/app/components/skeletons/ProfileSkeleton";
import { useProfilestore } from "@/store/usePorfileStore";
import { useTransactionsStore } from "@/store/useTransactionsStore";
import { Loader2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useEffect } from "react";

const page = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const {
    profile,
    getProfileInfo,
    isFetchingProfile,
    isAddingMoney,
    isWithdrawingMoney,
    addMoney,
    withdrawMoney,
  } = useProfilestore();

  const { transactions, getAllTransactions, isFetchingTransactions } =
    useTransactionsStore();

  useEffect(() => {
    if (profile === null) getProfileInfo();
    if (transactions.length === 0) getAllTransactions();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    await addMoney({ amount: Number(depositAmount) });
    setDepositAmount("");
    setOpenAdd(false);
  }
  async function handleWithdraw(e) {
    e.preventDefault();
    await withdrawMoney({ amount: Number(withdrawAmount) });
    setWithdrawAmount("");
    setOpenWithdraw(false);
  }

  const withdrawnMoney = useMemo(() => {
    return transactions
      .filter((tr) => tr.type === "WITHDRAW")
      .reduce((acc, tr) => acc + tr.totalAmount, 0);
  }, [transactions]);

  const depositedMoney = useMemo(() => {
    return transactions
      .filter((tr) => tr.type === "DEPOSIT")
      .reduce((acc, tr) => acc + tr.totalAmount, 0);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tr) => tr.type === "DEPOSIT" || tr.type === "WITHDRAW")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [transactions]);

  if (isFetchingProfile || isFetchingTransactions) return <ProfileSkeleton />;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200">
      <div className="max-w-5xl mx-auto">
        {openAdd && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Add Money</h3>
              <form onSubmit={handleAdd} className="mt-4 space-y-3" action="">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Enter Amount"
                />
                <div className="flex gap-2">
                  <button
                    className="btn btn-primary flex-1"
                    disabled={isAddingMoney}
                  >
                    {isAddingMoney ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Add"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setOpenAdd(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {openWithdraw && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Withdraw Money</h3>
              <form
                onSubmit={handleWithdraw}
                className="mt-4 space-y-3"
                action=""
              >
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Enter Amount"
                />
                <div className="flex gap-2">
                  <button
                    className="btn btn-primary flex-1"
                    disabled={isWithdrawingMoney}
                  >
                    {isWithdrawingMoney ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Withdraw"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setOpenWithdraw(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="card bg-base-100 shadow-xl border border-base-300 mt-5 m-4">
          <div className="card-body">
            <div className="flex items-center gap-4 mb-4">
              <div className="avatar placeholder">
                <div className="bg-primary flex justify-center items-center text-primary-content rounded-full w-16">
                  <span className="text-2xl font-bold">
                    {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-2xl font-bold">
                  {profile?.name
                    ? profile.name.charAt(0).toUpperCase() +
                      profile.name.slice(1).toLowerCase()
                    : "User"}
                </p>
                <p className="text-base-content/60">
                  {profile?.email || "Loading..."}
                </p>
              </div>
            </div>

            <div className="divider my-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-base-200 rounded-lg p-4">
                <p className="text-sm text-base-content/60">Email</p>
                <p className="font-semibold">
                  {profile?.email || "Loading..."}
                </p>
              </div>

              <div className="bg-base-200 rounded-lg p-4">
                <p className="text-sm text-base-content/60">Member Since</p>
                <p className="font-semibold">
                  {profile?.createdAt
                    ? new Date(profile?.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl border border-base-300 m-4">
          <div className="card-body">
            <p className="text-sm text-base-content/60 uppercase tracking-wider">
              Cash Balance
            </p>

            <h2 className="text-3xl font-bold text-primary">
              ₹{(profile?.cash || 0).toLocaleString()}
            </h2>

            <div className="flex gap-3 mt-4">
              <button
                className="btn btn-primary flex-1"
                onClick={() => setOpenAdd(true)}
              >
                Deposit
              </button>
              <button
                className="btn btn-outline btn-error flex-1"
                onClick={() => setOpenWithdraw(true)}
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-4">
          <div className="card shadow-xl bg-base-100 border border-base-300">
            <div className="card-body">
              <p className="text-sm text-base-content/60">Total Withdrawn</p>

              <h2 className="text-3xl font-bold text-error">
                ₹{(withdrawnMoney || 0).toLocaleString()}
              </h2>
            </div>
          </div>
          <div className="card shadow-xl bg-base-100 border border-base-300">
            <div className="card-body">
              <p className="text-sm text-base-content/60">Total Deposited</p>

              <h2 className="text-3xl font-bold text-success">
                ₹{(depositedMoney || 0).toLocaleString()}
              </h2>
            </div>
          </div>
        </div>
        <div className="card shadow-xl bg-base-100 border border-base-300 m-4">
          <div className="card-body">
            <h1 className="text-2xl font-bold">Recent Cash Activity</h1>

            <div className="space-y-3 mt-4">
              {filteredTransactions.slice(0, 5).map((t) => (
                <div
                  key={t._id}
                  className="flex justify-between items-center p-3 rounded-lg bg-base-200"
                >
                  {/* LEFT */}
                  <div>
                    <p className="font-semibold">
                      {t.type === "DEPOSIT" ? "Money Added" : "Money Withdrawn"}
                    </p>

                    <p className="text-xs text-base-content/60">
                      {new Date(t.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div
                    className={`font-bold ${
                      t.type === "DEPOSIT" ? "text-success" : "text-error"
                    }`}
                  >
                    {t.type === "DEPOSIT" ? "+" : "-"}₹
                    {(t.totalAmount || 0).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
