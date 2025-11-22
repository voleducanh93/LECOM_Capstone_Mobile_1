import { communityApi } from "@/api/community"
import { useMutation } from "@tanstack/react-query"

export const useCreateCommunityPost = () => {
  return useMutation({
    mutationFn: ({
      title,
      body,
    }: {
      title: string
      body: string
    }) => communityApi.createPost({ title, body }),
  })
}
