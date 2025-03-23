import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { formatEther } from "@/lib/contractUtils"

interface CampaignCardProps {
  id: number
  title: string
  description: string
  goal: string
  amountCollected: string
  deadline: string
  completed: boolean
  goalReached: boolean
}

export function CampaignCard({
  id,
  title,
  description,
  goal,
  amountCollected,
  deadline,
  completed,
  goalReached,
}: CampaignCardProps) {
  const progress = (Number.parseFloat(amountCollected) / Number.parseFloat(goal)) * 100

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between text-sm">
            <span>{formatEther(amountCollected)} ETH raised</span>
            <span>{formatEther(goal)} ETH goal</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Ends on: {new Date(Number.parseInt(deadline) * 1000).toLocaleDateString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Status: {completed ? "Completed" : goalReached ? "Goal Reached" : "Active"}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/campaign/${id}`}
          className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}

