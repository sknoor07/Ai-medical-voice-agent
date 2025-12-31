import { PricingTable } from "@clerk/nextjs";

export default function billing() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
      <div className=" pt-2 pb-10">
        <h2 className="font-bold text-3xl">Subscriptions Plans Available</h2>
      </div>
      <PricingTable />
    </div>
  );
}
