"use client";

import React from "react";
import { FormBuilderLayout } from "@/components/funding/formbuilder/FormBuilderLayout";
import { FormsProvider } from "@/context/funding/FormsContext";

export default function DirectPitchFormPage() {
  return (
    <FormsProvider>
      <div className="h-screen flex flex-col">
        <FormBuilderLayout
          ownerType="directPitch"
          ownerId="org_1"
        />
      </div>
    </FormsProvider>
  );
}
