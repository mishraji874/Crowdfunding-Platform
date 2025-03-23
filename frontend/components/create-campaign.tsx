"use client"

import type React from "react"
import { useState } from "react"
import { ethers, BrowserProvider, parseEther, Contract } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { contractABI } from "@/lib/contractABI"

// Replace with your actual contract address
const CONTRACT_ADDRESS = "0x2EEDe633208F30cf76fD52BBEDceFB36184250a0"

export function CreateCampaign() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [goal, setGoal] = useState("")
  const [deadline, setDeadline] = useState("")

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask")

    const provider = new BrowserProvider(window.ethereum)
  }

  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!window.ethereum) return alert("Please install MetaMask")

      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const parsedAmount = parseEther(goal)
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000)

      const contract = new Contract(CONTRACT_ADDRESS, contractABI, signer)

      const tx = await contract.createCampaign(title, description, parsedAmount, deadlineTimestamp)
      await tx.wait()

      alert("Campaign created successfully!")
      setTitle("")
      setDescription("")
      setGoal("")
      setDeadline("")
    } catch (error) {
      console.error("Error creating campaign:", error)
      alert("Failed to create campaign. Please try again.")
    }
  }

  return (
    <form onSubmit={createCampaign} className="space-y-4">
      <Input
        type="text"
        placeholder="Campaign Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Campaign Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Input
        type="number"
        placeholder="Goal (in ETH)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        required
        min="0"
        step="0.01"
      />
      <Input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Create Campaign
      </Button>
    </form>
  )
}

