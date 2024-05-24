import NavBar from '@components/NavBar';
import SideMenu from '@components/SideMenu';
import { useAuth } from '@src/hooks/useAuth';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainLayout({
  children,
  hideMenu = false,
}: {
  children;
  hideMenu?: boolean;
}) {
  const [state, setState] = React.useState(true);
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();

  React.useEffect(() => {
    isLoggedIn() ? null : navigate('/signin');
  }, [isLoggedIn()]);

  if (!isLoggedIn()) return <></>;

  if (hideMenu)
    return (
      <div className="  h-full  relative">
        <NavBar state={state} setState={setState} hideMenu />
        <div className={` px-2 md:px-3 py-10  relative h-full  `}>
          <span className=" absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 z-[-1] -translate-y-1/2 opacity-5 flex items-center justify-center">
            <img
              src="/logo.svg"
              alt=""
              className=" object-contain w-full max-h-[80vh]"
            />
          </span>
          {children}
        </div>
      </div>
    );

  return (
    <>
      <div className="  h-full  relative">
        <NavBar state={state} setState={setState} />
        <div className=" grid grid-cols-12">
          <div
            className={` ${
              state ? 'col-span-2 md:col-span-3 xl:col-span-2' : ' hidden'
            }  relative `}
          >
            <SideMenu />
          </div>
          <div
            className={` ${
              state
                ? 'col-span-10 md:col-span-9 xl:col-span-10  '
                : ' col-span-12'
            } px-2 md:px-3 py-10  relative h-full  `}
          >
            <span className=" absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 z-[-1] -translate-y-1/2 opacity-5 flex items-center justify-center">
              <img
                src="/logo.svg"
                alt=""
                className=" object-contain w-full max-h-[80vh]"
              />
            </span>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default MainLayout;
