import { useState, useEffect } from "react";
import { pinata } from "../Web3Helpers/pinataConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { getAccount } from "@wagmi/core";
import { config } from "../Web3Helpers/Web3Provider";
import { abi } from "../Web3Helpers/abi";

function Analyze() {
  const [metadata, setMetadata] = useState({
    name: "",
    description: "",
    audioIpfsUrl: "",
  });
  const [audioFile, setAudioFile] = useState<File>();
  const [audioIpfsHash, setAudioIpfsHash] = useState<String>();
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingTokenURI, setIsCreatingTokenURI] = useState(false);
  const [tokenURI, setTokenURI] = useState<String>("");
  const [isopen, setIsOpen] = useState(false);
  const { data: hash, writeContract } = useWriteContract();
  const account = getAccount(config);

  useEffect(() => {
    if (tokenURI !== "") {
      interactContract();
    }
  }, [tokenURI]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAudioFile(event.target?.files?.[0]);
  };

  const handleMLAnalyze = () => {
    toast("Didnt implement ML yet 😁", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    return;
  };

  const uploadToIpfs = async () => {
    if (!audioFile) {
      toast("Please upload a file first ⚠️", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    setIsUploading(true);
    try {
      const upload = await pinata.upload.file(audioFile);
      setAudioIpfsHash(upload.IpfsHash);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
      toast("File Uploaded to IPFS ✅", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const interactContract = async () => {
    console.log(tokenURI);
    writeContract({
      address: "0x814134Aee9a67eF9b42bFdb386BbeA6796CbAC28",
      abi,
      functionName: "mintNFT",
      args: [account.address, tokenURI],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const mintNFT = async () => {
    if (account.address === undefined) {
      toast("Connect your wallet ⚠️", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    uploadToIpfs();
    setIsCreatingTokenURI(true);

    const nftMetadata = {
      name: metadata.name,
      description: metadata.description,
      audio: `ipfs://${audioIpfsHash}`,
      attributes: [
        {
          trait_type: "Media",
          value: "Audio",
        },
        {
          trait_type: "Audio URL",
          value: `ipfs://${audioIpfsHash}`,
        },
      ],
    };

    try {
      const upload = await pinata.upload.json(nftMetadata);
      console.log(upload);
      setTokenURI(upload.IpfsHash);
      console.log(tokenURI);
      setIsCreatingTokenURI(false);
    } catch (error) {
      console.log(error);
    } finally {
      setAudioIpfsHash("");
      toast("NFT metadata uploaded to IPFS ✅", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">NFT Audio Minting</h1>

      <div className="mb-8 p-6 shadow-md rounded-lg">
        <label className="block text-lg font-semibold text-gray-800 mb-2">
          Upload Audio
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:border-blue-500"
        />

        <button
          onClick={handleMLAnalyze}
          disabled={isUploading}
          className={`mx-2 py-3 px-4 rounded-lg text-white font-bold 
            ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-sky-500 hover:bg-sky-600"}
            border border-black shadow-lg`}
        >
          {isUploading ? "Please wait. Analyzing..." : "Analyze"}
        </button>

        <ToastContainer />

        <div className="flex flex-col mt-6 text-center">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Verify the Audio?
          </label>
          <button
            onClick={() => setIsOpen(!isopen)}
            className="py-2 px-6 rounded-lg bg-green-500 hover:bg-green-600 text-white shadow-md"
          >
            {isopen ? "Hide Verification" : "Click to Verify"}
          </button>
        </div>
        <div className={isopen ? "block" : "hidden"}>
          <div className="mb-8 p-6 bg-white shadow-md rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <label className="mx-4 font-semibold text-gray-800 mb-2">
                NFT Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter NFT name"
                onChange={(e) =>
                  setMetadata({ ...metadata, name: e.target.value })
                }
                className="mx-4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="mx-4 text-lg font-semibold text-gray-800 mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter description"
                onChange={(e) =>
                  setMetadata({ ...metadata, description: e.target.value })
                }
                className="mx-4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
              ></textarea>
            </div>

            <button
              onClick={mintNFT}
              disabled={isConfirming}
              className={`mx-2 py-3 px-4 rounded-lg text-white font-bold 
                ${isConfirming || isCreatingTokenURI ? "bg-gray-400 cursor-not-allowed" : "bg-sky-500 hover:bg-sky-600"}
                border border-black shadow-lg`}
            >
              {isConfirming
                ? "Please wait. Minting...."
                : isCreatingTokenURI
                  ? "Creating Token URI"
                  : "Mint NFT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analyze;
