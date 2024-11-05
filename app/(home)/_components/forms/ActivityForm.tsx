import React, { useCallback, useEffect } from "react";
import { useResumeContext } from "@/context/resume-info-provider";
import { Button } from "@/components/ui/button";
import { Loader, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useUpdateDocument from "@/features/document/use-update-document";
import { generateThumbnail } from "@/lib/helper";
import { toast } from "@/hooks/use-toast";

const initialState = {
  id: undefined,
  docId: undefined,
  activityName: "",
  startDate: "",
  endDate: "",
  description: "",
};

const ActivityForm = (props: { handleNext: () => void }) => {
  const { handleNext } = props;
  const { resumeInfo, onUpdate } = useResumeContext();

  const { mutateAsync, isPending } = useUpdateDocument();

  const [activityList, setActivityList] = React.useState(() => {
    return resumeInfo?.activities?.length
      ? resumeInfo.activities
      : [initialState];
  });

  useEffect(() => {
    if (!resumeInfo) return;
    onUpdate({
      ...resumeInfo,
      activities: activityList,
    });
  }, [activityList]);

  const handleChange = (
    e: { target: { name: string; value: string } },
    index: number
  ) => {
    const { name, value } = e.target;

    setActivityList((prevState) => {
      const newActivityList = [...prevState];
      newActivityList[index] = {
        ...newActivityList[index],
        [name]: value,
      };
      return newActivityList;
    });
  };

  const addNewActivity = () => {
    setActivityList([...activityList, initialState]);
  };

  const removeActivity = (index: number) => {
    const updatedActivity = [...activityList];
    updatedActivity.splice(index, 1);
    setActivityList(updatedActivity);
  };

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();

      const thumbnail = await generateThumbnail();
      const currentNo = resumeInfo?.currentPosition
        ? resumeInfo.currentPosition + 1
        : 1;

      await mutateAsync(
        {
          currentPosition: currentNo,
          thumbnail: thumbnail,
          activity: activityList,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Activity updated successfully",
            });
            handleNext();
          },
          onError() {
            toast({
              title: "Error",
              description: "Failed to update activity",
              variant: "destructive",
            });
          },
        }
      );
    },
    [resumeInfo, activityList]
  );

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Achievements & Projects</h2>
        <p className="text-sm">Add your achievements/honors details</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div
          className="border w-full h-auto
              divide-y-[1px] rounded-md px-3 pb-4 my-5
              "
        >
          {activityList?.map((item, index) => (
            <div key={index}>
              <div
                className="relative grid gride-cols-2
                  mb-5 pt-4 gap-3
                  "
              >
                {activityList?.length > 1 && (
                  <Button
                    variant="secondary"
                    type="button"
                    disabled={isPending}
                    className="size-[20px] text-center
                rounded-full absolute -top-3 -right-5
                !bg-black dark:!bg-gray-600 text-white
                "
                    size="icon"
                    onClick={() => removeActivity(index)}
                  >
                    <X size="13px" />
                  </Button>
                )}

                <div className="col-span-2">
                  <Label className="text-sm">Project/Honors title</Label>
                  <Input
                    name="activityName"
                    placeholder=""
                    required
                    value={item?.activityName || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <Label className="text-sm">Start Date</Label>
                  <Input
                    name="startDate"
                    type="date"
                    placeholder=""
                    required
                    value={item?.startDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <Label className="text-sm">End Date</Label>
                  <Input
                    name="endDate"
                    type="date"
                    placeholder=""
                    required
                    value={item?.endDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="col-span-2 mt-1">
                  <Label className="text-sm">Description</Label>
                  <Textarea
                    name="description"
                    placeholder=""
                    required
                    value={item.description || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
              </div>

              {index === activityList.length - 1 &&
                activityList.length < 5 && (
                  <Button
                    className="gap-1 mt-1 text-primary 
                          border-primary/50"
                    variant="outline"
                    type="button"
                    disabled={isPending}
                    onClick={addNewActivity}
                  >
                    <Plus size="15px" />
                    Add More Achievements
                  </Button>
                )}
            </div>
          ))}
        </div>
        <Button className="mt-4" type="submit" disabled={isPending}>
          {isPending && <Loader size="15px" className="animate-spin" />}
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default ActivityForm;