import { checkHasNewOrder } from "@/api";
import { showNotification, detectInternetState } from "@/helper";
import { inject, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router"

export const useNotification = () => {
  const route = useRoute()
  const { getOrders, loadOrderStatusList } = inject("useOrders", {});
  const hasNewOrder = ref(false);

  const notificationSound = new Audio(
    import.meta.env.DEV
      ? "/notification-sound.wav"
      : window?.wooEasyLife?.dist_url + "/notification-sound.wav"
  );
  
  // Preload audio
  notificationSound.preload = "auto";

  const playNotificationSound = async () => {
    try {
      notificationSound.currentTime = 0; // Reset to start
      await notificationSound.play();
    } catch (audioError) {
      console.warn("Failed to play notification sound:", audioError);
    }
  };

  const checkNewOrderStatus = async (cb?: any) => {
    try {
      const { data } = await checkHasNewOrder();
      if (data?.has_new_orders) { // Fixed: removed the NOT operator
        await playNotificationSound();
        
        hasNewOrder.value = true;
        showNotification({
          type: 'success',
          message: 'New Order Received 🎉'
        })

        if (route.name === 'orders' && loadOrderStatusList) {
          await loadOrderStatusList();
        }
      }
    } catch (error) {
      console.error("Error checking new order status:", error)
    } finally {
      if (cb && typeof cb === "function") {
        cb();
      }
    }
  }

  onBeforeUnmount(() => {
    notificationSound.pause();
    notificationSound.currentTime = 0;
  });

  return {
    hasNewOrder,
    checkNewOrderStatus
  };
};
