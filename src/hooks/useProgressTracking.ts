import { useEffect, useState } from "react";
import { CategorySchema, ExerciseSchema, ExerciseTypeSchema, MonthSchema } from "../config/realm";
import { Month, getAvailableMonths } from "../utils/util";
import { useRealm } from "./useRealm";
import { ChartData } from "../screens/ProgressTracking/ChartData";

type ChartType = "Bar" | "Line"

interface Chart {
    chartData: number[];
    maxExercises: number;
    days: number[];
    currentMonth: number;
    availableMonths: Month[];
    lastHalf: boolean;
    filteredCategories: CategorySchema[];
    filteredExerciseTypes: ExerciseTypeSchema[];
    mode: 'Weekly' | 'Daily';
    loading: boolean;
    metric: boolean;
    pr: boolean;
    year: number
    chartType: ChartType
    exercisesByYear: ExerciseSchema[]
}

export const useProgressTracking = (mounted: boolean) => {
    const { data: exercises, loading: exercisesLoading } = useRealm<ExerciseSchema>({ schemaName: 'Exercise' });
    const { data: categories, loading: categoriesLoading } = useRealm<CategorySchema>({ schemaName: 'Category' });
    const { data: months, loading: monthsLoading, refresh } = useRealm<MonthSchema>({ schemaName: 'Month' });
    const { data: allExerciseTypes, loading: exerciseTypesLoading } = useRealm<ExerciseTypeSchema>({ schemaName: 'ExerciseType' });

    const [loaded, setLoaded] = useState(false)

    const [state, setState] = useState<Chart>({
        chartData: [],
        maxExercises: 0,
        days: [],
        currentMonth: 0,
        year: 0,
        lastHalf: false,
        filteredCategories: [],
        filteredExerciseTypes: [],
        availableMonths: [],
        exercisesByYear: [],
        mode: 'Daily',
        loading: false,
        metric: false,
        pr: false,
        chartType: 'Bar'
    });

    useEffect(() => {
        const theExercises = state.year === 0 ? exercises : exercises.filter((e) => e.year === state.year);
        const newAvailableMonths = getAvailableMonths(months, state.year)
        setState({ ...state, exercisesByYear: theExercises , availableMonths: newAvailableMonths, currentMonth: 0 })
        console.log("yeart efect")
    }, [state.year, exercises])

    const updateChart = (
        availableMonths: Month[],
        newCurrentMonth: number,
        lh: boolean,
        filteredExerciseTypes: ExerciseTypeSchema[],
        newCategories?: CategorySchema[],
        selectedCategories?: CategorySchema[],
        pr?: boolean
    ) => {
        const exc = state.mode === 'Daily' ? state.exercisesByYear.filter((e) => e.month === availableMonths[newCurrentMonth]?.numerical) : state.exercisesByYear;

        const filteredExercises =
            filteredExerciseTypes.length === 0 ? exc : exc.filter((e) => filteredExerciseTypes.some((et) => et.id === e.type.id));

        let { chartData, maxExercises, days } = ChartData({
            exercises: filteredExercises,
            categories: newCategories || state.filteredCategories,
            month: availableMonths[newCurrentMonth]?.numerical,
            year: '2023',
            metric: state.metric,
            lastHalf: lh,
            pr: pr !== undefined ? pr : state.pr && filteredExerciseTypes.length !== 1 ? false : state.pr,
            mode: state.mode,
        });

        setState({
            ...state,
            chartData,
            maxExercises,
            days,
            currentMonth: newCurrentMonth,
            lastHalf: lh,
            availableMonths: availableMonths,
            loading: mounted && true,
            filteredExerciseTypes: filteredExerciseTypes,
            filteredCategories: stateValueOrDefined('filteredCategories', selectedCategories),
            pr: pr !== undefined ? pr : state.pr && filteredExerciseTypes.length !== 1 ? false : state.pr,
        });
    };

    const stateValueOrDefined = <T extends keyof typeof state>(stateValue: T, newValue: typeof state[T] | undefined) => {
        return newValue === undefined ? state[stateValue] : newValue
    }

    const getChartData = async (
        lh?: boolean,
        cm?: number,
        selectedCategories?: CategorySchema[],
        newExerciseTypes?: ExerciseTypeSchema[],
        pr?: boolean
    ) => {
        console.log('getting chartdata')
        const newCategories =
            selectedCategories?.length === 0
                ? categories
                : categories.filter((category) => selectedCategories?.some((c) => c.id === category.id));

        const availableMonths = state.mode === 'Weekly' ? [{ numerical: 0, name: "Q1/Q2" }] : (state.availableMonths.length === 0 || state.availableMonths[0].name === 'Q1/Q2' || state.availableMonths[0].name === 'Q3/Q4') ? getAvailableMonths(months, state.year) : state.availableMonths;
        if (availableMonths.length === 0) return;

        updateChart(
            availableMonths,
            stateValueOrDefined('currentMonth', cm),
            stateValueOrDefined('lastHalf', lh),
            stateValueOrDefined('filteredExerciseTypes', newExerciseTypes),
            newCategories,
            selectedCategories,
            stateValueOrDefined('pr', pr)
        );
    };


    useEffect(() => {
        if (!exerciseTypesLoading && !exercisesLoading && !categoriesLoading && !monthsLoading)
            setLoaded(true)
    }, [exerciseTypesLoading, exercisesLoading, categoriesLoading, monthsLoading])

    return { state, setState, getChartData, updateChart, months, allExerciseTypes, categories, loaded }
}