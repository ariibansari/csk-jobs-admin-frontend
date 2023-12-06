import { Ban, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";

const SubscriptionCheckoutCancelled = () => {
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    let tempTime = 5
    setInterval(() => {
      tempTime--
      setTimer(tempTime)
      if (tempTime === 0) {
        window.location.pathname = "/"
      }
    }, 1000)
  }, []);

  return (
    <div className="w-[100%] h-[100vh] flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <Ban className="text-destructive absolute top-0 -left-2" />
        <CreditCard className="w-16 h-16" />
      </div>
      <h1 className="text-xl">Payment was cancelled</h1>
      <p className="text-center">The subscription was not successful as payment was cancelled by you.</p>
      <p className="text-muted-foreground text-center">Redirecting you back to Dashboard in {timer}s...</p>
    </div>
  );
};

export default SubscriptionCheckoutCancelled;
