import React, { createContext, useEffect, useState } from 'react';

import _ from 'lodash'

// import CmsConstant from 'utils/cms-constant';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'rootReducer';
// import tokenManager from 'utils/token-manager';
import { useRouter } from 'next/router';
import { query as queryFeeds } from 'features/feed/slices/feed.slice';

enum RouteType {
  BackOffice = 'back_office',
  Public = 'public'
}

const permissionsByRole = {
  'journalist': ['new'],
  'lead_journalist': ['new', 'awaiting_review_by_lead_journalist'],
  'video_editor': ['awaiting_video_upload'],
  'lead_video_editor': ['awaiting_video_upload', 'awaiting_review_by_lead_video_editor'],
  'feed_manager': ['pushed_to_feed', 'ready_for_push', 'decrement_ordinal', 'increment_ordinal', 'removed_from_feed'],
  'user_manager': [],
  'super_admin': ['new', 'awaiting_review_by_lead_journalist', 'awaiting_video_upload', 'awaiting_review_by_lead_video_editor', 'ready_for_push', 'pushed_to_feed', 'decrement_ordinal', 'removed_from_feed']
};

const AccessControlContext = createContext(null);

function AccessControlProvider({ children }) {

  const router = useRouter()

  const dispatch = useDispatch()
  const { isAuthenticated, currentUser, token } = useSelector((state: RootState) => state.auth)
  const { feeds } = useSelector((state: RootState) => state.feed)
  const [routeType, setRouteType] = useState<RouteType>(null)
  // const [currentToken, setCurrentToken] = useState<string>(null)

  useEffect(() => {
    setRouteType(router.pathname.startsWith('/cms') ? RouteType.BackOffice : RouteType.Public)
  }, [router.pathname])

  // useEffect(() => {
  //   tokenManager.setToken(token)
  //   setCurrentToken(token)
  // }, [token])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(queryFeeds())
    }
  }, [isAuthenticated])

  // Route restrictions

  useEffect(()=>{
    if (routeType === RouteType.BackOffice && !isAuthenticated) {
      router.push('/')
    }
  
    if (routeType === RouteType.BackOffice && isAuthenticated) {
      if(router.pathname === '/cms/stock-videos' && !(hasRole('video_editor') || hasRole('lead_video_editor') || hasRole('super_admin'))){
        router.push('/cms')
      }
    }
  
  
    if (routeType === RouteType.Public && isAuthenticated) {
      router.push('/cms')
    }
  })
  

  // Roles and permissions functions 

  const hasRole = (role: string) => {
    return !!currentUser.admin_roles.find(adminRole => adminRole.id === role)
  }

  const hasPermission = (permission: string) => {
    let allowedPermissions = []

    currentUser.admin_roles.forEach(adminRole => {
      allowedPermissions = allowedPermissions.concat(permissionsByRole[adminRole.id])
    })

    allowedPermissions = _.uniq(allowedPermissions)

    return allowedPermissions.includes(permission)
  }

  const initialState = {
    hasRole,
    hasPermission,
  };


  return (
    <AccessControlContext.Provider value={initialState}>
      {(routeType === RouteType.Public || (routeType === RouteType.BackOffice && isAuthenticated && token && feeds.length > 0)) && children}
    </AccessControlContext.Provider>
  );
}

export { AccessControlContext, AccessControlProvider };