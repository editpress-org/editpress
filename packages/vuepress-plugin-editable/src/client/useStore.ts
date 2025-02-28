/**
 * simple store by reactive
 * event bus
 *
 */
import { useRoute } from 'vuepress/client';
import { reactive, onMounted, h, render, ref, nextTick } from "vue";
import { useThemeData } from '@vuepress/plugin-theme-data/client';
import type { OwnerRepo } from '../typings';
import Loading from './components/Loading';
import Poptip from './components/Poptip';

interface PreviewData {
  content: string,
  status: boolean,
  owner: string
  repo: string
  path: string
}


interface StoreData {
  showLoading: boolean,
  reviewData: PreviewData,
  closeStatus: boolean,
  status: boolean
  isAuth: boolean
  repo: string,
  owner: string,
}

const getOwnerRepo = (ownerRepo: string): OwnerRepo => {
  const strArr = ownerRepo.split('/');
  return {
    owner: strArr[0] ? strArr[0] : '',
    repo: strArr[1] ? strArr[1] : '',
  };
}


export function useStore() {

  const themeData = useThemeData().value as { repo?: string }
  const { repo, owner } = getOwnerRepo(themeData.repo || '')

  const storeData = reactive<StoreData>({
    showLoading: false,
    reviewData: {
      content: '',
      status: false,
      owner: '',
      repo: '',
      path: ''
    },

    closeStatus: false,
    status: false,
    /**
     * check auth status
    */
    isAuth: false,
    repo,
    owner,
  })

  const poptipData = ref({
    success: false,
    data: {},
    message: ''
  },)

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
    const vNode = h(Loading)
    render(vNode, document.body)
  }
  const setClose = (status: boolean) => {
    storeData.closeStatus = status;
  }


  const setStatus = (status: boolean) => {
    storeData.status = status;
  }

  const setAuth = (status: boolean) => {
    storeData.isAuth = status;
  }

  const renderPoptip = (status) => {
    const vNode = h(Poptip, { poptipData, poptipStatus: status })
    render(vNode, document.body)
  }
  const setPoptipData = (json, status: boolean) => {
    poptipData.value = json, status

    nextTick(() => {
      renderPoptip(status)
    })
  }

  const actions = {
    setReviewData,
    setLoading,
    setClose,
    setAuth,
    setPoptipData,
  }


  return {
    storeData,
    actions,
  }
}
