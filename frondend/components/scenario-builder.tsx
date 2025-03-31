"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { PlusCircle, Trash2, MoveVertical, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"

export default function ScenarioBuilder() {
  const { toast } = useToast()
  const [blocks, setBlocks] = useState([
    {
      id: "block-1",
      type: "space",
      title: "Space Configuration",
      parameters: [
        { id: "total-area", name: "Total Area (sqm)", value: 350 },
        { id: "foh-percentage", name: "FOH Percentage", value: 70 },
        { id: "seating-capacity", name: "Seating Capacity", value: 120 },
      ],
    },
    {
      id: "block-2",
      type: "service",
      title: "Service Parameters",
      parameters: [
        { id: "covers-per-waiter", name: "Covers per Waiter", value: 15 },
        { id: "runner-ratio", name: "Runner Ratio", value: 2 },
        { id: "service-style", name: "Service Style", value: "Full Service" },
      ],
    },
    {
      id: "block-3",
      type: "hours",
      title: "Operational Hours",
      parameters: [
        { id: "operating-days", name: "Operating Days per Week", value: 7 },
        { id: "daily-hours", name: "Daily Operating Hours", value: 12 },
        { id: "peak-hour-factor", name: "Peak Hour Factor", value: 1.5 },
      ],
    },
  ])

  const blockTypes = [
    { id: "space", name: "Space Configuration", color: "bg-blue-100 border-blue-300" },
    { id: "service", name: "Service Parameters", color: "bg-green-100 border-green-300" },
    { id: "hours", name: "Operational Hours", color: "bg-amber-100 border-amber-300" },
    { id: "efficiency", name: "Efficiency Drivers", color: "bg-purple-100 border-purple-300" },
    { id: "custom", name: "Custom Parameters", color: "bg-gray-100 border-gray-300" },
  ]

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(blocks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setBlocks(items)
  }

  const addBlock = (type) => {
    const blockType = blockTypes.find((b) => b.id === type)
    const newBlock = {
      id: `block-${blocks.length + 1}`,
      type,
      title: blockType.name,
      parameters: [],
    }

    // Add default parameters based on type
    if (type === "space") {
      newBlock.parameters = [
        { id: `${newBlock.id}-param-1`, name: "Total Area (sqm)", value: 300 },
        { id: `${newBlock.id}-param-2`, name: "FOH Percentage", value: 70 },
      ]
    } else if (type === "service") {
      newBlock.parameters = [
        { id: `${newBlock.id}-param-1`, name: "Covers per Waiter", value: 15 },
        { id: `${newBlock.id}-param-2`, name: "Runner Ratio", value: 2 },
      ]
    } else if (type === "hours") {
      newBlock.parameters = [
        { id: `${newBlock.id}-param-1`, name: "Operating Days per Week", value: 7 },
        { id: `${newBlock.id}-param-2`, name: "Daily Operating Hours", value: 12 },
      ]
    } else if (type === "efficiency") {
      newBlock.parameters = [
        { id: `${newBlock.id}-param-1`, name: "Staff Utilization", value: 85 },
        { id: `${newBlock.id}-param-2`, name: "Technology Impact", value: 10 },
      ]
    } else {
      newBlock.parameters = [
        { id: `${newBlock.id}-param-1`, name: "Parameter 1", value: 50 },
        { id: `${newBlock.id}-param-2`, name: "Parameter 2", value: 50 },
      ]
    }

    setBlocks([...blocks, newBlock])
  }

  const removeBlock = (blockId) => {
    setBlocks(blocks.filter((block) => block.id !== blockId))
  }

  const updateParameterValue = (blockId, paramId, newValue) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId) {
          return {
            ...block,
            parameters: block.parameters.map((param) => {
              if (param.id === paramId) {
                return { ...param, value: newValue }
              }
              return param
            }),
          }
        }
        return block
      }),
    )
  }

  const addParameter = (blockId) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId) {
          return {
            ...block,
            parameters: [
              ...block.parameters,
              {
                id: `${blockId}-param-${block.parameters.length + 1}`,
                name: `New Parameter ${block.parameters.length + 1}`,
                value: 50,
              },
            ],
          }
        }
        return block
      }),
    )
  }

  const removeParameter = (blockId, paramId) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId) {
          return {
            ...block,
            parameters: block.parameters.filter((param) => param.id !== paramId),
          }
        }
        return block
      }),
    )
  }

  const updateParameterName = (blockId, paramId, newName) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId) {
          return {
            ...block,
            parameters: block.parameters.map((param) => {
              if (param.id === paramId) {
                return { ...param, name: newName }
              }
              return param
            }),
          }
        }
        return block
      }),
    )
  }

  const saveScenario = () => {
    toast({
      title: "Scenario Saved",
      description: "Your custom scenario has been saved successfully.",
    })
  }

  const getBlockColor = (type) => {
    const blockType = blockTypes.find((b) => b.id === type)
    return blockType ? blockType.color : "bg-gray-100 border-gray-300"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Drag & Drop Scenario Builder</h3>
          <p className="text-sm text-muted-foreground">Build your scenario by adding and arranging parameter blocks</p>
        </div>
        <Button onClick={saveScenario}>
          <Save className="h-4 w-4 mr-2" />
          Save Scenario
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {blockTypes.map((type) => (
          <Button
            key={type.id}
            variant="outline"
            size="sm"
            onClick={() => addBlock(type.id)}
            className={`${type.color} border`}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add {type.name}
          </Button>
        ))}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="scenario-blocks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`border-2 ${getBlockColor(block.type)}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div {...provided.dragHandleProps} className="flex items-center">
                            <MoveVertical className="h-5 w-5 mr-2 text-muted-foreground" />
                            <CardTitle className="text-md">{block.title}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{block.parameters.length} parameters</Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBlock(block.id)}
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription>Adjust parameters for this block</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {block.parameters.map((param) => (
                            <div key={param.id} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="flex-1 mr-2">
                                  <Input
                                    value={param.name}
                                    onChange={(e) => updateParameterName(block.id, param.id, e.target.value)}
                                    className="h-8"
                                  />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeParameter(block.id, param.id)}
                                  className="h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex-1">
                                  <Slider
                                    value={[param.value]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(value) => updateParameterValue(block.id, param.id, value[0])}
                                  />
                                </div>
                                <div className="w-12 text-right">
                                  <span className="text-sm font-medium">{param.value}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addParameter(block.id)}
                            className="w-full mt-2"
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Parameter
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {blocks.length === 0 && (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">
            No parameter blocks added yet. Use the buttons above to add blocks to your scenario.
          </p>
        </div>
      )}
    </div>
  )
}

