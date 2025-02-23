/**
 * simple store by reactive
 * event bus
 *
 */
import { usePageData, useRoute } from 'vuepress/client';
import { reactive, onMounted, computed, toRaw, toRef, ref } from "vue";

interface PreviewData {
  content: string,
  status: boolean,
  owner: string
  repo: string
  path: string
}

interface PoptipData {
  success: boolean,
  data: any,
  message: string
  not_found_repo_link?: string
}

interface StoreData {
  showLoading: boolean,
  reviewData: PreviewData,
  poptipData: PoptipData,
  closeStatus: boolean,
  status: boolean
  isAuth: boolean
  isEditing: boolean
}

export function useStore() {

  const storeData = reactive<StoreData>({
    showLoading: false,
    reviewData: {
      content: '', // TODO
      status: false,
      owner: '',
      repo: '',
      path: ''
    },
    poptipData: {
      success: false,
      data: {},
      message: ''
    },
    closeStatus: false,
    status: false,
    /**
     * check auth status
    */
    isAuth: false,
    /**
     * check editing
    */
    isEditing: false
  })

  onMounted(() => {
    const router = useRoute()
    const accessToken = router?.query?.accessToken;
    const Auth = !!(accessToken && accessToken.length === 40);
    setAuth(Auth)
  })

  const setReviewData = (json) => {
    storeData.reviewData = { ...json };

  }
  const setLoading = (status: boolean) => {
    storeData.showLoading = status;
  }
  const setClose = (status: boolean) => {
    storeData.closeStatus = status;
  }

  const setPoptipData = (json: any, status: boolean) => {
    storeData.poptipData = json;
    setStatus(status);
  }
  const setStatus = (status: boolean) => {
    storeData.status = status;
  }

  const setAuth = (status: boolean) => {
    storeData.isAuth = status;
  }
  
  
  const setEditing = (status: boolean) => {
    console.log('setEditing=>',status)
    storeData.isEditing = status;
  }

  const actions = {
    setReviewData,
    setLoading,
    setClose,
    setPoptipData,
    setAuth,
    setEditing
  }

  return {
    storeData,
    actions
  }
}
