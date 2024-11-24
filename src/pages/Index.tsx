import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";

const Index = () => {
  const navigate = useNavigate();
  const { items, reserveItem } = useStore();
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [reservationData, setReservationData] = useState({ name: "", email: "" });

  const fuse = new Fuse(items, {
    keys: ["description"],
    threshold: 0.3,
  });

  const filteredItems = search
    ? fuse.search(search).map((result) => result.item)
    : items;

  const handleReserve = (id: string) => {
    reserveItem(id, reservationData.name, reservationData.email);
    setSelectedItem(null);
    setReservationData({ name: "", email: "" });
    toast.success("Item reserved successfully! Please collect within 7 days.");
  };

  const handleAdminAccess = () => {
    const password = prompt("Please enter admin password:");
    if (password === "510Team") {
      navigate("/admin");
    } else {
      toast.error("Invalid password");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Lost & Found</h1>
        <Button onClick={handleAdminAccess} variant="outline">
          Admin
        </Button>
      </div>

      <div className="mb-8">
        <Input
          type="search"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const daysLeft = 30 - differenceInDays(new Date(), new Date(item.createdAt));
          const statusColors = {
            Lost: "bg-[hsl(var(--status-lost))]",
            Reserved: "bg-[hsl(var(--status-reserved))]",
            Found: "bg-[hsl(var(--status-found))]",
          };

          return (
            <div
              key={item.id}
              className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={item.imageUrl}
                alt={item.description}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`${
                      statusColors[item.status]
                    } text-white px-2 py-1 rounded-full text-sm`}
                  >
                    {item.status}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {daysLeft > 0
                      ? `${daysLeft} days left`
                      : "Expired"}
                  </span>
                </div>
                <p className="text-lg mb-4">{item.description}</p>
                {item.status === "Lost" && daysLeft > 0 && (
                  <Button
                    onClick={() => setSelectedItem(item.id)}
                    className="w-full"
                  >
                    Recover
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recover Item</DialogTitle>
            <DialogDescription>
              Please provide your details to reserve this item. You will have 7 days to collect it from the gym.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={reservationData.name}
                onChange={(e) =>
                  setReservationData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={reservationData.email}
                onChange={(e) =>
                  setReservationData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => selectedItem && handleReserve(selectedItem)}
              disabled={!reservationData.name || !reservationData.email}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;