"use client";
import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200">
      <div className="max-w-5xl mx-auto p-4 space-y-4 animate-pulse">

        {/* PROFILE CARD */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body space-y-4">

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-base-300" />

              <div className="space-y-2">
                <div className="h-5 w-40 bg-base-300 rounded" />
                <div className="h-4 w-56 bg-base-300 rounded" />
              </div>
            </div>

            <div className="divider my-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-16 bg-base-300 rounded-lg" />
              <div className="h-16 bg-base-300 rounded-lg" />
            </div>
          </div>
        </div>

        {/* CASH BALANCE */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body space-y-3">
            <div className="h-4 w-32 bg-base-300 rounded" />
            <div className="h-10 w-48 bg-base-300 rounded" />

            <div className="flex gap-3 mt-4">
              <div className="h-10 flex-1 bg-base-300 rounded" />
              <div className="h-10 flex-1 bg-base-300 rounded" />
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body space-y-2">
              <div className="h-4 w-32 bg-base-300 rounded" />
              <div className="h-8 w-40 bg-base-300 rounded" />
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body space-y-2">
              <div className="h-4 w-32 bg-base-300 rounded" />
              <div className="h-8 w-40 bg-base-300 rounded" />
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body space-y-4">

            <div className="h-6 w-48 bg-base-300 rounded" />

            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-base-200 rounded-lg"
              >
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-base-300 rounded" />
                  <div className="h-3 w-24 bg-base-300 rounded" />
                </div>

                <div className="h-4 w-20 bg-base-300 rounded" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileSkeleton;