import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import { useAuth } from '@src/hooks/useAuth';
import { gradientBackGround } from '@src/styles/globalMuiStyls';
import { Link, useLocation } from 'react-router-dom';
import ViewTimelineOutlinedIcon from '@mui/icons-material/ViewTimelineOutlined';
import { t } from 'i18next';

const SideMenuList = [
  {
    title: t('Workers'),
    roles: ['admin'],
    icon: <GroupIcon color="inherit" />,
    path: '/workers',
  },
  {
    title: t('Time Statstics'),
    roles: ['admin'],
    icon: <ViewTimelineOutlinedIcon color="inherit" />,
    path: '/timeManagement',
  },
  {
    title: 'Einstellungen',
    roles: ['admin'],
    icon: <SettingsIcon color="inherit" />,
    path: '/settings',
  },
];

function SideMenu() {
  const { pathname } = useLocation();
  const { GetUserData } = useAuth();

  return (
    <div className=" h-full min-h-[calc(100vh-80px)] max-h-[100vh] sticky top-0 ">
      <Paper className=" h-full px-1 lg:px-3" elevation={3}>
        <List>
          {SideMenuList.filter((item) =>
            item.roles.includes(GetUserData()?.role)
          ).map((item, index) => {
            return (
              <ListItem
                disablePadding
                key={index}
                sx={{
                  backgroundImage: pathname.startsWith(item.path)
                    ? gradientBackGround
                    : '',
                  color: pathname.startsWith(item.path) ? '#fff' : '',
                  fontWeight: pathname.startsWith(item.path) ? 800 : '',
                  borderRadius: '9px',
                }}
              >
                <Link to={item.path} className=" w-full">
                  <ListItemButton sx={{ borderRadius: '9px' }}>
                    <ListItemIcon>
                      <span
                        className={`${
                          pathname.startsWith(item.path) ? 'text-white' : ''
                        } `}
                      >
                        {item.icon}
                      </span>
                    </ListItemIcon>
                    <span className=" hidden md:block">
                      <ListItemText
                        primary={item.title}
                        sx={{
                          fontWeight: pathname.startsWith(item.path) ? 800 : '',
                        }}
                      />
                    </span>
                  </ListItemButton>
                </Link>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </div>
  );
}

export default SideMenu;
