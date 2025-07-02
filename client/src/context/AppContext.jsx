import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";
import humanizeDuration from "humanize-duration";
import { dummyCourses } from "../assets/assets"; // Importing dummy data from assets.js

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const { user } = useUser(); // Get user from Clerk

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true); // Defaulting to true for now
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  // Setting up user data from Clerk
  useEffect(() => {
    if (user) {
      setUserData({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
      });

      // Logic to set isEducator based on user role or some condition
      setIsEducator(user?.roles?.includes('educator') || true); // Example: If user has 'educator' role, set true
    }
  }, [user]);

  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses); // Using dummy data imported from assets.js
  };

  // Function to calculate the rating of a course
  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }

    let totalRating = 0;
    course.courseRatings.forEach(rating => {
      totalRating += rating.rating;
    });
    return Math.floor(totalRating / course.courseRatings.length);
  };

  // Function to Calculate Course Chapter Time
  const calculateChapterTime = (chapter) => {
    let time = 0;

    if (chapter.chapterContent && Array.isArray(chapter.chapterContent)) {
      chapter.chapterContent.forEach((lecture) => {
        time += lecture.lectureDuration || 0;
      });
    }

    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function to Calculate Course Duration
  const calculateCourseDuration = (course) => {
    let time = 0;

    if (course.courseContent && Array.isArray(course.courseContent)) {
      course.courseContent.forEach(
        (chapter) => {
          if (chapter.chapterContent && Array.isArray(chapter.chapterContent)) {
            chapter.chapterContent.forEach(
              (lecture) => time += lecture.lectureDuration || 0
            );
          }
        }
      );
    }

    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Fetch User Enrolled Courses
  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses); // Using dummy data imported from assets.js
  };

  // Function to Calculate Number of Lectures in a Course
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;

    if (course.courseContent && Array.isArray(course.courseContent)) {
      course.courseContent.forEach(chapter => {
        if (chapter.chapterContent && Array.isArray(chapter.chapterContent)) {
          totalLectures += chapter.chapterContent.length;
        }
      });
    }

    return totalLectures;
  };

  useEffect(() => {
    fetchAllCourses();
    fetchUserEnrolledCourses();
  }, []);

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses,
    userData // Add userData to the context value
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
