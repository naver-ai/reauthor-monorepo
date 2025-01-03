import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Http } from '../../../net/http';
import { IUserWithAgendaIds } from '@core';
import { AppState, AppThunk } from '../../../redux/store';


const userEntityAdapter = createEntityAdapter<IUserWithAgendaIds, string>({
  selectId: (model: IUserWithAgendaIds) => {
    return model._id}
})

const initialUserEntityAdapterState = userEntityAdapter.getInitialState()

export type IManageState = {
  isLoadingUserList: boolean,
  isCreatingUser:  boolean,
  userEntityState: typeof initialUserEntityAdapterState
};

const initialState: IManageState = {
  
  isLoadingUserList: false,
  isCreatingUser: false,
  userEntityState: initialUserEntityAdapterState
};

const manageSlice = createSlice({
  name: 'MANAGE',
  initialState,
  reducers: {
    initialize: () => {
      return { ...initialState };
  },

  _setLoadingUserListFlag: (state, action: PayloadAction<boolean>) => {
      state.isLoadingUserList = action.payload
  },

  _setCreatingUserFlag: (state, action: PayloadAction<boolean>) => {
    state.isCreatingUser = action.payload
  },
  _setLoadedUsers: (state, action: PayloadAction<Array<IUserWithAgendaIds>>) => {
    userEntityAdapter.setAll(state.userEntityState, action.payload)
  },

  setOneUser: (state, action: PayloadAction<IUserWithAgendaIds>) => {
      userEntityAdapter.setOne(state.userEntityState, action.payload)
  },

  _appendUser: (state, action: PayloadAction<IUserWithAgendaIds>) => {
    userEntityAdapter.addOne(state.userEntityState, action.payload)
  }
  },
});

export const usersSelectors = userEntityAdapter.getSelectors((state: AppState) => state.admin.users.userEntityState)

export const loadUsers = (): AppThunk => {
  return async(dispatch, getState) => {
    const state = getState();
    if(state.admin.auth.token != null && state.admin.users.isLoadingUserList == false) {
      dispatch(manageSlice.actions._setLoadingUserListFlag(true))
      try {
        const resp = await Http.axios.get('/admin/users/all', {
          headers: Http.makeSignedInHeader(state.admin.auth.token)
        })
        const users: IUserWithAgendaIds[] = resp.data.userList
        dispatch(manageSlice.actions._setLoadedUsers(users))
      } catch (err) {
        console.log(err)
      } finally {
        dispatch(manageSlice.actions._setLoadingUserListFlag(false))
      }
    }
  }
}

export const createUser = (info: {passcode: string, alias: string, isKorean: boolean}, onCreated: (user: IUserWithAgendaIds) => void, onError?: (error: any) => void): AppThunk => {
  return async(dispatch, getState) => {
    const state = getState();
    if (state.admin.auth.token != null) {
      dispatch(manageSlice.actions._setCreatingUserFlag(true))
      try {
        const resp = await Http.axios.post('/admin/users/new', {
          userInfo: info
        },{
          headers: Http.makeSignedInHeader(state.admin.auth.token)
        })
        dispatch(manageSlice.actions._appendUser(resp.data.user))
        onCreated(resp.data.user)
      } catch (err) {
        console.log(err)
        // onError(err)
      } finally {
        dispatch(manageSlice.actions._setCreatingUserFlag(false))
      }
    }
  }
}

export const {setOneUser} = manageSlice.actions

export default manageSlice.reducer;
