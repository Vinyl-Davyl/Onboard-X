// createAsyncThunk helping creae http request from redux
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import employeeService from "./employeeService";
import { toast } from "react-toastify";

const initialState = {
  employee: null,
  employees: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  totalEmployeeValue: 0,
  outOfService: 0,
  category: [],
};

// Create New Employeee
export const createEmployee = createAsyncThunk(
  // giving it a name
  "employees/create",
  async (formData, thunkAPI) => {
    try {
      return await employeeService.createEmployee(formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all Employeee
export const getEmployees = createAsyncThunk(
  // giving it a name
  "employees/getAll",
  async (_, thunkAPI) => {
    try {
      return await employeeService.getEmployees();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete an Employee
export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (id, thunkAPI) => {
    try {
      return await employeeService.deleteEmployee(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    CALC_STORE_VALUE(state, action) {
      const employees = action.payload;
      const array = [];
      employees.map((item) => {
        const { salary, rating } = item;
        const employeeValue = salary * rating;
        // creating a new array and then returning the value of each employee
        return array.push(employeeValue);
      });
      // totalValue
      const totalValue = array.reduce((a, b) => {
        return a + b;
      }, 0);
      state.totalEmployeeValue = totalValue;
    },
    CALC_OUTOFSERVICE(state, action) {
      const employees = action.payload;
      const array = [];
      employees.map((item) => {
        const { rating } = item;

        return array.push(rating);
      });
      let count = 0;
      array.forEach((number) => {
        if (number === 0 || number === "0") {
          count += 1;
        }
      }),
        (state.outOfService = count);
    },

    CALC_CATEGORY(state, action) {
      const employees = action.payload;
      const array = [];
      employees.map((item) => {
        const { category } = item;

        return array.push(category);
      });
      // look out for unique categories
      const uniqueCategory = [...new Set(array)];
      state.category = uniqueCategory;
    },
  },
  // storing responses from createAsyncThunk
  extraReducers: (builder) => {
    builder.addCase(createEmployee.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createEmployee.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      // employee in JSON
      console.log(action.payload);
      // pushing employee inside employees array to create new employee next
      state.employees.push(action.payload);
      toast.success("Employee added successfully");
    });
    builder
      .addCase(createEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // get employees
      .addCase(getEmployees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        console.log(action.payload);
        state.employees = action.payload;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // delete employees
      .addCase(deleteEmployees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Employee deleted successfully");
      })
      .addCase(deleteEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { CALC_STORE_VALUE, CALC_OUTOFSERVICE, CALC_CATEGORY } =
  employeeSlice.actions;

// exporting isLoading state to be used on addEmployee(& any part of app) when loading
export const selectIsLoading = (state) => state.employee.isLoading;

export const selectTotalEmployeeValue = (state) =>
  state.employee.totalEmployeeValue;

export const selectOutOfService = (state) => state.employee.outOfService;

export const selectCategory = (state) => state.employee.category;

export default employeeSlice.reducer;
