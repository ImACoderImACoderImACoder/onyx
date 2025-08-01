import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Div from "../Shared/StyledComponents/Div";
import PrideText from "../../../themes/PrideText";

const InstallButton = styled.button`
  font-size: 1.25rem;
  min-height: 2.75rem;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.buttonColorMain},
    ${(props) => props.theme.buttonColorMain}
  );
  color: ${(props) => props.theme.primaryFontColor};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  width: auto;
  margin: 0px 2.5px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const PWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Let Chrome show its automatic prompt while also capturing the event
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    const handleAppInstalled = () => {
      setShowInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstall(false);
    }

    // Force check after a delay (sometimes the event fires before React components mount)
    const checkTimer = setTimeout(() => {
      if (window.deferredPrompt) {
        setDeferredPrompt(window.deferredPrompt);
        setShowInstall(true);
      }
    }, 1000);

    return () => {
      clearTimeout(checkTimer);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    // Clear the deferredPrompt so it can only be used once
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) {
    return null;
  }

  return (
    <Div>
      <h2>
        <PrideText text="Install PWA App to Device" />
      </h2>
      <div
        style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}
      >
        <InstallButton onClick={handleInstallClick}>
          📱 Install App
        </InstallButton>
      </div>
    </Div>
  );
};

// Export a hook to check if PWA install is available
export const usePWAInstallAvailable = () => {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const checkAvailability = () => {
      // Check if already installed
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsAvailable(false);
        return;
      }
      
      // Check if there's a deferred prompt
      if (window.deferredPrompt) {
        setIsAvailable(true);
        return;
      }
      
      // Listen for the prompt event
      const handler = (e) => {
        setIsAvailable(true);
      };
      
      window.addEventListener('beforeinstallprompt', handler);
      
      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    };

    checkAvailability();
  }, []);

  return isAvailable;
};

export default PWAInstall;
