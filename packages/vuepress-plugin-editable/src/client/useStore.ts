/**
 * simple store by reactive
 * event bus
 *
 */
import { useRoute } from 'vuepress/client';
import { reactive, onMounted } from "vue";

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
}

export function useStore() {
  const router = useRoute()

  const storeData = reactive<StoreData>({
    showLoading: false,

    reviewData: {
      content: '',
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
  })

  onMounted(() => {
    const accessToken = router.query.accessToken;
    
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

  const actions = {
    setReviewData,
    setLoading,
    setClose,
    setPoptipData,
    setAuth
  }
  return {
    storeData,
    actions
  }
}
