"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { getContract, parseEther } from "@/lib/contractUtils"
import Modal from "@/components/modal"
import { BrowserProvider } from "ethers"

const OWNER_ADDRESS = "0x0B970EB36C1EC85706fDB4f0F3AEB572dFC3582b"

export default function CreateCampaign() {
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [goal, setGoal] = useState("")
  const [deadline, setDeadline] = useState("")
  const router = useRouter()

  const [modalMessage, setModalMessage] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new BrowserProvider(window.ethereum)
          const accounts = await provider.listAccounts()
          const address = accounts[0].address
          setCurrentAddress(address)
          setIsOwner(address?.toLowerCase() === OWNER_ADDRESS.toLowerCase())
        } catch (error) {
          console.error("Error checking wallet:", error)
        }
      }
    }

    checkWalletConnection()
  }, [])

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const contract = await getContract(true)
      const goalInWei = parseEther(goal)
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000)

      const tx = await contract.createCampaign(title, description, goalInWei, deadlineTimestamp)
      setModalMessage("Transaction submitted! Waiting for confirmation...")
      setModalVisible(true)

      await tx.wait()
      setModalMessage("🎉 Campaign created successfully! Redirecting...")

      // Delay redirect to show success message
      setTimeout(() => {
        router.push("/projects")
      }, 3000)
    } catch (error) {
      console.error("Error creating campaign:", error)
      setModalMessage("❌ Failed to create campaign. Transaction cancelled or an error occurred.")
      setModalVisible(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentAddress) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please connect your wallet to access this page
          </p>
        </div>
      </main>
    )
  }

  if (!isOwner) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Restricted Access</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This page is only accessible to the platform owner. To create a campaign, please contact:
          </p>
          <a
            href="mailto:developer.adityamsr@gmail.com"
            className="text-blue-600 hover:text-blue-700 text-xl font-medium"
          >
            developer.adityamsr@gmail.com
          </a>
          <p className="mt-4 text-sm text-gray-500">
            Please include your project details and wallet address in your email.
          </p>
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 font-medium">⚠️ Important Notice:</p>
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">
              Any attempt to submit false or fraudulent campaign requests will result in immediate blacklisting
              of the wallet address and legal action may be taken. We maintain a strict verification process
              to protect our community.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 md:p-24">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Create a New Campaign</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Launch your crowdfunding campaign and bring your ideas to life with the power of Web3
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-3">Campaign Guidelines</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>Provide a clear and compelling title for your campaign</li>
            <li>Write a detailed description explaining your goals</li>
            <li>Set a realistic funding goal in ETH</li>
            <li>Choose a reasonable deadline for your campaign</li>
          </ul>
        </div>

        <form onSubmit={handleCreateCampaign} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Campaign Title</label>
            <Input
              type="text"
              placeholder="Enter a compelling title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full"
            />
            <p className="text-xs text-gray-500">Make it clear and attention-grabbing</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Campaign Description</label>
            <Textarea
              placeholder="Describe your campaign in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-[200px]"
            />
            <p className="text-xs text-gray-500">Include your goals, plans, and how the funds will be used</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Funding Goal (ETH)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
                min="0"
                step="0.01"
              />
              <p className="text-xs text-gray-500">Set a realistic goal for your campaign</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Deadline</label>
              <Input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">Choose a reasonable timeframe</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 
              hover:border-blue-700 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] 
              transition-all duration-200 font-semibold text-lg py-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span>Creating Campaign...</span>
                </span>
              ) : (
                "Launch Campaign"
              )}
            </Button>
            <p className="text-xs text-center mt-2 text-gray-500">
              By creating a campaign, you agree to our terms and conditions
            </p>
          </div>
        </form>
      </div>
      {modalVisible && <Modal message={modalMessage} onClose={() => setModalVisible(false)} />}
    </main>
  )
}

