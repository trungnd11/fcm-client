import { Ref, ref } from "vue";
import { jwtDecode } from "jwt-decode";
import { LocalStorageKeyEnum } from "../../enums/LocalStorageKeyEnum";

export default function useToken<T extends object>() {
  const tokenRefs: Record<string, any> = {};

  (function getToken() {
    const tokenLocal = localStorage.getItem(LocalStorageKeyEnum.ACCESS_TOKEN);
    if (tokenLocal) {
      const jsonToken = jwtDecode<T>(tokenLocal);

      // tạo ref cho từng key
      for (const [key, value] of Object.entries(jsonToken)) {
        tokenRefs[key] = ref(value);
      }
    }
  })();

  return tokenRefs as { [K in keyof T]: Ref<T[K]> };
}
