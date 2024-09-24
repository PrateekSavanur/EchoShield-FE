import { Web3Provider } from "../Web3Helpers/Web3Provider";
import { ConnectKitButton } from "connectkit";
import { useSwitchChain } from "wagmi";
import { Logo } from "../assets";

function Navbar() {
  const { chains, switchChain } = useSwitchChain();
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
            <div className="p-2 m-3 border border-black rounded-lg">
              <select
                className="bg-sky-600"
                onChange={(e) =>
                  switchChain({ chainId: Number(e.target.value) })
                }
              >
                {chains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Web3Provider>
    </div>
  );
}

export default Navbar;
