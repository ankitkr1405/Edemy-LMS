import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import YouTube from 'react-youtube';
import { assets } from '../../assets/assets';
import { useParams } from 'react-router-dom';
import humanizeDuration from 'humanize-duration';
import Rating from '../../components/student/Rating';
import Footer from '../../components/student/Footer';
import Loading from '../../components/student/Loading';
import "quill/dist/quill.snow.css";

const Player = () => {
  const { enrolledCourses, calculateChapterTime, userData } = useContext(AppContext);
  const { courseId } = useParams(); // Get the courseId from the URL
  const [courseData, setCourseData] = useState(null);
  const [progressData, setProgressData] = useState({ lectureCompleted: [] });
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  const getCourseData = () => {
    if (!courseId || !Array.isArray(enrolledCourses) || enrolledCourses.length === 0) {
      console.log("Course ID or Enrolled Courses are missing or invalid");
      return; // Exit early if there's no courseId or no enrolled courses
    }

    const course = enrolledCourses.find((course) => course._id === courseId);

    if (course) {
      setCourseData(course);
      
      // Only check for ratings if userData exists and course has ratings
      if (userData && course.courseRatings && Array.isArray(course.courseRatings)) {
        const rating = course.courseRatings.find(item => item.userId === userData._id);
        if (rating) {
          setInitialRating(rating.rating);
        }
      }
    } else {
      // Log an error message if no course matches the courseId
      console.error(`No course found with ID: ${courseId}`);
      setCourseData(null); // Optionally set to null if no course is found
    }
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    console.log("Course ID from URL:", courseId);
    console.log("Enrolled Courses:", enrolledCourses);

    if (enrolledCourses.length > 0) {
      getCourseData();
    } else {
      console.log("Waiting for enrolledCourses to load...");
    }
  }, [courseId, enrolledCourses, userData]); // Add userData to dependencies

  const markLectureAsCompleted = (lectureId) => {
    setProgressData(prevData => ({
      ...prevData,
      lectureCompleted: [...(prevData?.lectureCompleted || []), lectureId]
    }));
  };

  const handleRate = (rating) => {
    setInitialRating(rating);
  };

  // Show a loading state while the course data is being fetched or if enrolledCourses is empty
  if (!enrolledCourses.length) {
    return <Loading />;
  }

  return courseData ? (
    <>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
        <div className=" text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>
          <div className="pt-5">
            {courseData.courseContent && Array.isArray(courseData.courseContent) && courseData.courseContent.map((chapter, index) => (
              <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={assets.down_arrow_icon}
                      alt="arrow icon"
                      className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""}`}
                    />
                    <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                  </div>
                  <p className="text-sm md:text-default">
                    {chapter.chapterContent ? chapter.chapterContent.length : 0} lectures - {calculateChapterTime(chapter)}
                  </p>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-96" : "max-h-0"}`} >
                  <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                    {chapter.chapterContent && Array.isArray(chapter.chapterContent) && chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className="flex items-start gap-2 py-1">
                        <img
                          src={progressData && progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon}
                          alt="bullet icon"
                          className="w-4 h-4 mt-1"
                        />
                        <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                          <p>{lecture.lectureTitle}</p>
                          <div className='flex gap-2'>
                            {lecture.lectureUrl && 
                              <p 
                                onClick={() => setPlayerData({ 
                                  ...lecture, 
                                  chapter: index + 1, 
                                  lecture: i + 1 
                                })} 
                                className='text-blue-500 cursor-pointer'
                              >
                                Watch
                              </p>
                            }
                            <p>{humanizeDuration((lecture.lectureDuration || 0) * 60 * 1000, { units: ['h', 'm'] })}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className=" flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this Course:</h1>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>

        </div>

        <div className='md:mt-10'>
          {
            playerData
              ? (
                <div>
                  <YouTube 
                    iframeClassName='w-full aspect-video' 
                    videoId={playerData.lectureUrl ? playerData.lectureUrl.split('/').pop() : ''} 
                  />
                  <div className='flex justify-between items-center mt-1'>
                    <p className='text-xl '>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
                    <button 
                      onClick={() => markLectureAsCompleted(playerData.lectureId)} 
                      className='text-blue-600'
                    >
                      {progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              )
              : <img src={courseData.courseThumbnail} alt="" />
          }
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <div>Course not found or loading...</div> // Fallback UI when courseData is missing
  );
};

export default Player;