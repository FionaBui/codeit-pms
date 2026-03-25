import { getResourceAllocationForNextMonths } from "../../api/resourceAllocationApi.js";
import { useEffect } from "react";

export default function ResourcesAllocationsPage() {
  useEffect(() => {
    getResourceAllocationForNextMonths(1).then((resourceAllocations) => {
      console.log(resourceAllocations);
    });
  }, []);
  return <h1>Resources Allocations </h1>;
}
