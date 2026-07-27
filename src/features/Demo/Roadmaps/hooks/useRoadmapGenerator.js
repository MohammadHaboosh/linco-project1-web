import { useCallback, useEffect, useRef, useState } from "react";
import { roadmapApi } from "../api/roadmapApi";
import { useParams } from "react-router-dom";

export const useRoadmapGenerator = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const activeControllerRef = useRef(null);
  const { demoId, departmentId } = useParams();

  useEffect(
    () => () => {
      activeControllerRef.current?.abort();
    },
    [],
  );

  const generateRoadmap = useCallback(async (title) => {
    activeControllerRef.current?.abort();

    const controller = new AbortController();
    activeControllerRef.current = controller;
    setIsGenerating(true);
    setError(null);
    setRoadmap(null);

    try {
      const generatedRoadmap = await roadmapApi.generate(title, {
        demoId: demoId,
        departmentId: departmentId,
        signal: controller.signal,
      });

      if (controller.signal.aborted) return false;

      setRoadmap(generatedRoadmap);
      return true;
    } catch (requestError) {
      if (requestError.name === "AbortError") return false;

      setError(requestError.message || "Failed to generate roadmap.");
      return false;
    } finally {
      if (activeControllerRef.current === controller) {
        activeControllerRef.current = null;
        setIsGenerating(false);
      }
    }
  }, []);

  const reset = useCallback(() => {
    activeControllerRef.current?.abort();
    activeControllerRef.current = null;
    setRoadmap(null);
    setError(null);
    setIsGenerating(false);
  }, []);

  return {
    roadmap,
    isGenerating,
    error,
    generateRoadmap,
    reset,
  };
};
