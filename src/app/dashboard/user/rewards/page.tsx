"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Gift,
  Coins,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Lightbulb,
  MapPin,
  Timer,
} from "lucide-react";

interface Reward {
  id: string;
  name: string;
  description: string;
  image: string | null;
  pointCost: number;
  stock: number;
  bankSampah: {
    id: string;
    name: string;
  };
}

interface PointTransaction {
  id: string;
  amount: number;
  description: string;
  type: string;
  createdAt: string;
}

interface RedemptionHistory {
  id: string;
  pointsUsed: number;
  status: string;
  createdAt: string;
  reward: {
    id: string;
    name: string;
    description: string;
    image: string | null;
    pointCost: number;
  };
}

export default function RewardsPage() {
  const { data: session } = useSession();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [redemptionHistory, setRedemptionHistory] = useState<
    RedemptionHistory[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"rewards" | "history">("rewards");

  useEffect(() => {
    fetchRewards();
    fetchPoints();
    fetchRedemptionHistory();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await fetch("/api/rewards");
      if (!response.ok) throw new Error("Gagal mengambil data rewards");

      const result = await response.json();
      setRewards(result.data);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  const fetchPoints = async () => {
    try {
      const response = await fetch("/api/user/points");
      if (!response.ok) throw new Error("Gagal mengambil data poin");

      const result = await response.json();
      setCurrentPoints(result.currentPoints);
    } catch (error) {
      console.error("Error fetching points:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRedemptionHistory = async () => {
    try {
      const response = await fetch("/api/user/rewards");
      if (!response.ok) throw new Error("Gagal mengambil data riwayat");

      const result = await response.json();
      setRedemptionHistory(result.data);
    } catch (error) {
      console.error("Error fetching redemption history:", error);
    }
  };

  const handleClaimReward = async (rewardId: string, pointCost: number) => {
    if (currentPoints < pointCost) {
      alert("Poin Anda tidak mencukupi untuk menukar reward ini");
      return;
    }

    if (!confirm("Apakah Anda yakin ingin menukar reward ini?")) {
      return;
    }

    try {
      setClaimingId(rewardId);
      const response = await fetch("/api/user/rewards/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rewardId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengklaim reward");
      }

      const result = await response.json();
      alert(
        `Berhasil! ${result.message}\nSisa poin: ${result.remainingPoints}`,
      );

      // Refresh data
      fetchRewards();
      fetchPoints();
      fetchRedemptionHistory();
      setActiveTab("history");
    } catch (error: any) {
      console.error("Error claiming reward:", error);
      alert(`Gagal: ${error.message}`);
    } finally {
      setClaimingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            <CheckCircle className="w-3 h-3" />
            Selesai
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            <XCircle className="w-3 h-3" />
            Dibatalkan
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Gift className="w-8 h-8 text-green-600" />
          Reward
        </h1>
        <p className="text-gray-600">
          Tukarkan poin Anda dengan berbagai hadiah menarik
        </p>
      </div>

      {/* Points Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-50 mb-1 flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Total Poin Anda
            </p>
            <p className="text-4xl font-bold">
              {currentPoints.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-white/20 rounded-full p-4">
            <TrendingUp className="w-12 h-12" />
          </div>
        </div>
        <p className="text-green-50 text-sm mt-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Kumpulkan lebih banyak poin dengan menyetorkan produk olahan sampah ke
          bank sampah!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("rewards")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "rewards"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 hover:text-green-600"
          }`}>
          Katalog Reward
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "history"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 hover:text-green-600"
          }`}>
          Riwayat Penukaran
        </button>
      </div>

      {/* Rewards Grid */}
      {activeTab === "rewards" && (
        <div>
          {rewards.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Belum ada reward yang tersedia</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const canAfford = currentPoints >= reward.pointCost;
                const isOutOfStock = reward.stock <= 0;

                return (
                  <div
                    key={reward.id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg ${
                      !canAfford || isOutOfStock
                        ? "opacity-75"
                        : "hover:scale-105"
                    }`}>
                    {/* Image */}
                    <div className="relative h-48 bg-gray-100">
                      {reward.image ? (
                        <Image
                          src={reward.image}
                          alt={reward.name}
                          fill
                          className="object-contain p-4"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <Gift className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">
                            Stok Habis
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {reward.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {reward.description}
                      </p>

                      {/* Bank Sampah */}
                      <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {reward.bankSampah.name}
                      </p>

                      {/* Points and Stock */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 text-green-600 font-bold text-xl">
                          <Coins className="w-5 h-5" />
                          {reward.pointCost.toLocaleString("id-ID")}
                        </div>
                        <span className="text-sm text-gray-500">
                          Stok: {reward.stock}
                        </span>
                      </div>

                      {/* Claim Button */}
                      <button
                        onClick={() =>
                          handleClaimReward(reward.id, reward.pointCost)
                        }
                        disabled={
                          !canAfford || isOutOfStock || claimingId === reward.id
                        }
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          !canAfford || isOutOfStock
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : claimingId === reward.id
                              ? "bg-green-400 text-white cursor-wait"
                              : "bg-green-600 text-white hover:bg-green-700"
                        }`}>
                        {claimingId === reward.id
                          ? "Memproses..."
                          : !canAfford
                            ? `Butuh ${(reward.pointCost - currentPoints).toLocaleString("id-ID")} poin lagi`
                            : isOutOfStock
                              ? "Stok Habis"
                              : "Tukar Sekarang"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Redemption History */}
      {activeTab === "history" && (
        <div>
          {redemptionHistory.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Belum ada riwayat penukaran</p>
            </div>
          ) : (
            <div className="space-y-4">
              {redemptionHistory.map((redemption) => (
                <div
                  key={redemption.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      {redemption.reward.image ? (
                        <Image
                          src={redemption.reward.image}
                          alt={redemption.reward.name}
                          fill
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <Gift className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {redemption.reward.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {redemption.reward.description}
                          </p>
                        </div>
                        {getStatusBadge(redemption.status)}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-green-600" />
                          {redemption.pointsUsed.toLocaleString("id-ID")} poin
                        </span>
                        <span>•</span>
                        <span>{formatDate(redemption.createdAt)}</span>
                      </div>

                      {redemption.status === "PENDING" && (
                        <p className="mt-2 text-sm text-yellow-700 bg-yellow-50 p-2 rounded flex items-center gap-2">
                          <Timer className="w-4 h-4" />
                          Penukaran Anda sedang diproses oleh admin bank sampah
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
