/**
 * simple store by reactive
 * event bus
 *
 */
import { reactive } from "vue";

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
}

export function useStore() {

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
    status: false
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

  const actions = {
    setReviewData,
    setLoading,
    setClose,
    setPoptipData
  }
  return {
    storeData,
    actions
  }
}
