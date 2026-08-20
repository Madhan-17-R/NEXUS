"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type AlertType = "success" | "error" | "warning" | "info" | "loading";

export interface AlertMessage {
  id: string;
  type: AlertType;
  title: string;
  message: string;
}

interface AlertContextType {
  alerts: AlertMessage[];
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  showLoading: (title: string, message: string) => string;
  dismissAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const addAlert = useCallback(
    (type: AlertType, title: string, message: string) => {
      const id = `alert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      setAlerts((prev) => [...prev, { id, type, title, message }]);
      
      // Auto-dismiss for non-critical alerts
      if (type !== "error" && type !== "loading") {
        setTimeout(() => {
          dismissAlert(id);
        }, 5000);
      }
      return id;
    },
    [dismissAlert]
  );

  const showSuccess = useCallback((title: string, message: string) => addAlert("success", title, message), [addAlert]);
  const showError = useCallback((title: string, message: string) => addAlert("error", title, message), [addAlert]);
  const showWarning = useCallback((title: string, message: string) => addAlert("warning", title, message), [addAlert]);
  const showInfo = useCallback((title: string, message: string) => addAlert("info", title, message), [addAlert]);
  const showLoading = useCallback((title: string, message: string) => addAlert("loading", title, message), [addAlert]);

  return (
    <AlertContext.Provider
      value={{
        alerts,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showLoading,
        dismissAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
