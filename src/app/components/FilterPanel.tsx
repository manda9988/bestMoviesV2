// src/app/components/FilterPanel.tsx

import { VStack } from "@chakra-ui/react";
import { SingleFilter } from "./SingleFilter";
import { useState } from "react";

export function FilterPanel({
  onYearChange,
}: {
  onYearChange: (yearRange: string | null) => void; // Accept 'null' when no year is selected
}) {
  const [selectedYear, setSelectedYear] = useState<string>("");

  const handleYearChange = (value: string | string[]) => {
    const yearString = Array.isArray(value) ? value[0] : value;
    console.log("Year filter changed:", yearString);
    setSelectedYear(yearString);
    if (yearString) {
      onYearChange(yearString); // If year is selected, send it
    } else {
      onYearChange(null); // If no year is selected, send 'null'
    }
  };

  return (
    <VStack
      spacing={4}
      align="stretch"
      width={{ base: "95%", md: "60%" }}
      maxWidth="500px"
      marginBottom="6"
    >
      <SingleFilter
        title="Par années de production"
        options={[
          { value: "2020-2029", label: "2020 - 2029" },
          { value: "2010-2019", label: "2010 - 2019" },
          { value: "2000-2009", label: "2000 - 2009" },
          { value: "1990-1999", label: "1990 - 1999" },
          { value: "1980-1989", label: "1980 - 1989" },
        ]}
        onChange={handleYearChange}
      />

      <SingleFilter
        title="Trier par"
        options={[{ value: "rating", label: "Note spectateurs" }]}
      />
    </VStack>
  );
}
