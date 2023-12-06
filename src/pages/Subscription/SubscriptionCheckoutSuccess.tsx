import { Ban, Check, CreditCard, User } from "lucide-react";
import { useEffect, useState } from "react";

const SubscriptionCheckoutSuccess = () => {
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
        <Check className="text-green-500 absolute top-0 -left-2" />
        <User className="w-16 h-16" />
      </div>
      <h1 className="text-xl">Subscription Successful</h1>
      <p className="text-center">The payment was successfull and subscription was added to your account</p>
      <p className="text-muted-foreground text-center">Redirecting you back to Dashboard in {timer}s...</p>
    </div>
  );
};

export default SubscriptionCheckoutSuccess;