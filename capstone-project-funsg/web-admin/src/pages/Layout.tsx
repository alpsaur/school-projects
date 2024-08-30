import { Avatar } from "../components/catalystui/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "../components/catalystui/dropdown";
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "../components/catalystui/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "../components/catalystui/sidebar";
import { StackedLayout } from "../components/catalystui/stacked-layout";
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "../assets/logo_trans.png";
import AdminDefault from "../assets/admin-default.png";
import useRequests from "../hooks/useRequests.ts";
import useProfile from "../hooks/useProfile.ts";
import { signOut } from "../services/auth-service.ts";
import { useState } from "react";
import UserDetailsModal from "../components/UserDetailsModal.tsx";
import ProfileImageUploader from "../components/ProfileImageUploader.tsx";
import ReportModal from "../components/ReportModal.tsx";

interface LayoutProps {
  children?: React.ReactNode;
}

const navItems = [
  { label: "Dashboard", url: "/home" },
  { label: "Groups", url: "/home/groups" },
  { label: "Events", url: "/home/events" },
  { label: "Users", url: "/home/users" },
  { label: "Requests", url: "/home/requests" },
];

const Layout: React.FC<LayoutProps> = () => {
  const { data = [] } = useRequests();
  const { data: profile } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAvatarUploaderOpen, setIsAvatarUploaderOpen] =
    useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const profileImage = profile?.profileImage ?? AdminDefault;

  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleViewProfile = () => {
    if (profile) {
      setIsModalOpen(true);
    } else {
      console.error("Profile data is missing or invalid.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChangeAvatar = () => {
    setIsAvatarUploaderOpen(true);
  };

  const handleCloseAvatarModal = () => {
    setIsAvatarUploaderOpen(false);
  };

  const handleGenerateReport = () => {
    setIsReportOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportOpen(false);
  };

  let greeting = "";
  const currentTime = new Date();
  const hours = currentTime.getHours();
  if (hours < 12) {
    greeting = "Good Morning, ";
  } else if (hours < 18) {
    greeting = "Good Afternoon, ";
  } else {
    greeting = "Good Evening, ";
  }

  return (
    <>
      <StackedLayout
        navbar={
          <Navbar>
            <NavbarItem>
              <img src={Logo} className={"w-20"} />
            </NavbarItem>
            <NavbarDivider className="max-lg:hidden" />
            <NavbarSection className="max-lg:hidden">
              {navItems.map(({ label, url }) => (
                <NavbarItem key={label} href={url}>
                  <div className="flex items-center">
                    <span>{label}</span>
                    {label === "Requests" && data?.length > 0 && (
                      <span className="ml-1 rounded-full bg-red-500 text-white px-2 py-0.5 text-xs">
                        {data.length}
                      </span>
                    )}
                  </div>
                </NavbarItem>
              ))}
            </NavbarSection>
            <NavbarSpacer />
            <NavbarSection>
              <p>
                {greeting} {profile?.name}
              </p>
              <Dropdown>
                <DropdownButton as={NavbarItem}>
                  <Avatar src={profileImage} square />
                </DropdownButton>
                <DropdownMenu className="min-w-64" anchor="bottom end">
                  <DropdownDivider />
                  <DropdownItem onClick={handleChangeAvatar}>
                    <UserCircleIcon />
                    <DropdownLabel>Change Avatar</DropdownLabel>
                  </DropdownItem>
                  <DropdownItem onClick={handleViewProfile}>
                    <UserIcon />
                    <DropdownLabel>View profile</DropdownLabel>
                  </DropdownItem>
                  <DropdownItem onClick={handleGenerateReport}>
                    <DocumentArrowDownIcon />
                    <DropdownLabel>Monthly Report</DropdownLabel>
                  </DropdownItem>

                  <DropdownItem onClick={handleSignOut}>
                    <ArrowRightStartOnRectangleIcon />
                    <DropdownLabel>Sign out</DropdownLabel>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarSection>
          </Navbar>
        }
        sidebar={
          <Sidebar>
            <SidebarHeader>
              <Dropdown>
                <DropdownButton as={SidebarItem} className="lg:mb-2.5">
                  <Avatar src={profile?.profileImage} />
                  <SidebarLabel>FunSG Admin</SidebarLabel>
                  <ChevronDownIcon />
                </DropdownButton>
              </Dropdown>
            </SidebarHeader>
            <SidebarBody>
              <SidebarSection>
                {navItems.map(({ label, url }) => (
                  <SidebarItem key={label} href={url}>
                    {label}{" "}
                    {label === "Requests" && data.length > 0 && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-white text-xs">
                        {data.length}
                      </span>
                    )}
                  </SidebarItem>
                ))}
              </SidebarSection>
            </SidebarBody>
          </Sidebar>
        }
      >
        <Outlet />
        {isModalOpen && profile && (
          <UserDetailsModal user={profile} onClose={handleCloseModal} />
        )}

        {isAvatarUploaderOpen && (
          <ProfileImageUploader onClose={handleCloseAvatarModal} />
        )}

        {isReportOpen && <ReportModal onClose={handleCloseReportModal} />}
      </StackedLayout>
    </>
  );
};

export default Layout;
