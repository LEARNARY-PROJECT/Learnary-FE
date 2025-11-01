"use client"
import React from 'react'
import ChapterBox, { MockChapterData } from '@/components/ChapterBox'
import { useIsMobile } from '@/hooks/useIsMobile'
const CourseDetailPage = () => {
  const isMobile = useIsMobile();
  return isMobile ? (
    <div className={`flex ${isMobile ? 'w-full flex-col' : 'w-full'}`}>
      <div className={`video grow h-[350px] text-center m-3 rounded border-3`}>
              <video src="https://learnary-courses.s3.ap-southeast-2.amazonaws.com/League+of+Legends+(TM)+Client+2023-12-07+11-53-38.mp4" controls></video>
      </div>
      <ChapterBox chapters={MockChapterData} emptyState={'Chưa có bài học nào'}></ChapterBox>
    </div>
  ) : (
    <div className={`flex ${isMobile ? 'w-full flex-col' : 'w-full'}`}>
      <ChapterBox chapters={MockChapterData} emptyState={'Chưa có bài học nào'}></ChapterBox>
      <div className={`video grow h-[550px] text-center m-3 rounded border-3`}>
        <video src="https://learnary-courses.s3.ap-southeast-2.amazonaws.com/League+of+Legends+(TM)+Client+2023-12-07+11-53-38.mp4" controls></video>
      </div>
    </div>
  )
}

export default CourseDetailPage