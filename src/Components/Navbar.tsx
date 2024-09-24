import { Web3Provider } from "../Web3Helpers/Web3Provider";
import { ConnectKitButton } from "connectkit";
import { useSwitchChain } from "wagmi";
import { Logo } from "../assets";
import { useState } from "react";

function Navbar() {
  const { chains, switchChain } = useSwitchChain();
  const [selectedChain, setSelectedChain] = useState(1 || 111555111);
  return (
    <div className="p-3 bg-sky-600">
      <Web3Provider>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg font-bold">
            <img src={Logo} alt="logo" width={60} height={60} className="p-2" />
            EchoSheild
          </div>
          <div className="flex items-center">
            <ConnectKitButton />
            <div className="flex gap-2 p-2 m-3 rounded-lg">
              {chains.map((chain) => (
                <div
                  key={chain.id}
                  className={`cursor-pointer border border-black rounded-lg p-2 hover:bg-gray-200 ${selectedChain === chain.id ? "bg-gray-600" : ""}`}
                  onClick={() => {
                    switchChain({ chainId: chain.id });
                    setSelectedChain(chain.id);
                  }}
                >
                  {chain.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Web3Provider>
    </div>
  );
}

export default Navbar;
